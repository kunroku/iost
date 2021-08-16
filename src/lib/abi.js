const esprima = require("esprima");

class ContractABI {
  constructor(lang, version, abi) {
    this.lang = lang;
    this.version = version;
    this.abi = abi;
  }
  static compile(source) {
    function isClassDecl(stat) {
      return !!(stat && stat.type === "ClassDeclaration");
    }

    function isExport(stat) {
      return !!(
        stat &&
        stat.type === "AssignmentExpression" &&
        stat.left &&
        stat.left.type === "MemberExpression" &&
        stat.left.object &&
        stat.left.object.type === "Identifier" &&
        stat.left.object.name === "module" &&
        stat.left.property &&
        stat.left.property.type === "Identifier" &&
        stat.left.property.name === "exports"
      );
    }

    function getExportName(stat) {
      if (stat.right.type !== "Identifier") {
        throw new Error("module.exports should be assigned to an identifier");
      }
      return stat.right.name;
    }

    function isPublicMethod(def) {
      return def.key.type === "Identifier"
        && def.value.type === "FunctionExpression"
        && !def.key.name.startsWith("_");
    }

    function generateABI(def, lastPos, comments) {
      for (const param of def.value.params) {
        if (param.type !== "Identifier") {
          throw new Error(`invalid method parameter type. must be Identifier, got ${param.type}`);
        }
      }
      const abi = {
        name: def.key.name,
        args: new Array(def.value.params.length).fill("string"),
        amountLimit: [],
      };
      for (let i = comments.length - 1; i >= 0; i--) {
        const comment = comments[i];
        if (comment.range[0] > lastPos && comment.range[1] < def.range[0]) {
          for (const i in def.value.params) {
            for (const line of comment.value.split("\n")) {
              const name = def.value.params[i].name;
              const paramTypeString = /(string)/;
              const paramTypeNumber = /(number)/;
              const paramTypeBoolean = /(boolean|bool)/;
              const paramTypeJSON = /(json|\{[\s\S]*?\})/;
              const paramPatternString = new RegExp(`@param\\s*{${paramTypeString.source}}\\s*${name}`);
              const paramPatternNumber = new RegExp(`@param\\s*{${paramTypeNumber.source}}\\s*${name}`);
              const paramPatternBoolean = new RegExp(`@param\\s*{${paramTypeBoolean.source}}\\s*${name}`);
              const paramPatternJSON = new RegExp(`@param\\s*{${paramTypeJSON.source}}\\s*${name}`);
              if (line.match(paramPatternString)) {
                abi.args[i] = "string";
              } else if (line.match(paramPatternNumber)) {
                abi.args[i] = "number";
              } else if (line.match(paramPatternBoolean)) {
                abi.args[i] = "bool";
              } else if (line.match(paramPatternJSON)) {
                abi.args[i] = "json";
              }
              const amountLimitToken = /(\*|([a-z]+))/;
              const amountLimitVal = /(unlimited|([1-9]|[0-9]+))/;
              const amountLimitPattern = new RegExp(`@amount\\s*{${amountLimitToken.source}}\\s*${amountLimitVal.source}`);
              if (line.match(amountLimitPattern)) {
                const token = line.match(amountLimitPattern)[1];
                const val = line.match(amountLimitPattern)[3];
                if (!abi.amountLimit.find((amountLimit) => amountLimit.token === token)) {
                  abi.amountLimit.push({
                    token,
                    val
                  });
                }
              }
            }
          }
          break;
        }
      }
      return abi;
    }

    function generateABIArray(stat, comments) {
      const abiArr = [];
      if (!isClassDecl(stat) || stat.body.type !== "ClassBody") {
        throw new Error("invalid statement for generate abi. stat = " + stat);
      }
      let initFound = false;
      let lastPos = stat.body.range[0];
      for (const def of stat.body.body) {
        if (def.type === "MethodDefinition" && isPublicMethod(def)) {
          if (def.key.name === "constructor") {
            throw new Error("smart contract class shouldn't contain constructor method!");
          } else if (def.key.name === "init") {
            initFound = true;
          } else {
            abiArr.push(generateABI(def, lastPos, comments));
            lastPos = def.range[1];
          }
        }
      }
      if (!initFound) {
        throw new Error("init not found!");
      }
      return abiArr;
    }

    function checkInvalidKeyword(tokens) {
      for (const token of tokens) {
        if ((token.type === "Identifier" || token.type === "Literal") && ([
          "_IOSTInstruction_counter",
          "_IOSTBinaryOp",
          "IOSTInstruction",
          "_IOSTTemplateTag",
          "_IOSTSpreadElement",
        ].includes(token.value))) {
          throw new Error("use of _IOSTInstruction_counter or _IOSTBinaryOp keyword is not allowed");
        }
        if (token.type === "RegularExpression") {
          throw new Error(`use of RegularExpression is not allowed. ${token.value}`);
        }
        if (token.type === "Keyword" && ([
          "try",
          "catch",
        ].includes(token.value))) {
          throw new Error("use of try catch is not supported");
        }
      }
    }

    function compile(source) {
      const ast = esprima.parseModule(source, {
        range: true,
        loc: false,
        comment: true,
        tokens: true
      });
      let abiArr = [];
      if (!ast || ast === null || !ast.body || ast.body === null || ast.body.length === 0) {
        throw new Error("invalid source! ast = " + ast);
      }
      checkInvalidKeyword(ast.tokens);
      let className;
      for (const stat of ast.body) {
        if (
          !isClassDecl(stat)
          && stat.type === "ExpressionStatement"
          && isExport(stat.expression)
        ) {
          className = getExportName(stat.expression);
        }
      }
      for (let stat of ast.body) {
        if (isClassDecl(stat) && stat.id.type === "Identifier" && stat.id.name === className) {
          abiArr = generateABIArray(stat, ast.comments);
        }
      }
      return abiArr;
    }
    return new ContractABI("javascript", "1.0.0", compile(source));
  }
}

module.exports = ContractABI;