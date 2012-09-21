

var _ = require('underscore');

// Tokenizes the source.
// Tokens have the form:
//
//  [ TOKEN_TYPE, TOKEN_VALUE, LINE_NUMBER ]
//

exports.lex = function (source) {

  function isNumber (source, index) {
    var tokenValue = '';
    while (!isWhitespace(source, index) && !isCloseParenthesis(source, index)) {
      tokenValue += source[index++];
    }
    return String(Number(tokenValue)) !== 'NaN';
  }

  function isBoolean (source, index) {
    var tokenValue = '';
    while (!isWhitespace(source, index) && !isCloseParenthesis(source, index)) {
      tokenValue += source[index++];
    }
    return tokenValue === 'true' || tokenValue === 'false';
  }

  function isOpenParenthesis (source, index) {
    return source[index] === '(';
  }

  function isCloseParenthesis (source, index) {
    return source[index] === ')';
  }

  function isDoubleQuote (source, index) {
    return source[index] === '"';
  }

  function isDash (source, index) {
    return source[index] === '-';
  }

  function isQuestion (source, index) {
    return source[index] === '?';
  }

  function isBang (source, index) {
    return source[index] === '!';
  }

  function isWhitespace (source, index) {
    return source[index] === '\t' || source[index] === ' ';
  }

  function isNewline (source, index) {
    return source[index] === '\n';
  }

  function isSemicolon (source, index) {
    return source[index] === ';';
  }

  function lex (source) {
    var thisToken
      , thisChar
      , nextChar
      , lastChar
      , quoteState
      , tokenState;
    var charNumber = 0;
    var lineNumber = 0;
    var tokens     = [];

    while (charNumber < source.length) {
      token      = [];
      tokenValue = '';
      console.log(source[charNumber]);
      switch (true) {
        case isNewline(source, charNumber):
          console.log('newline');
          lineNumber += 1;
          charNumber += 1;
          break;
        case isWhitespace(source, charNumber):
          console.log('whitespace');
          charNumber += 1;
          break;
        case isOpenParenthesis(source, charNumber):
          console.log('openparent');
          token = ['OPEN_PARENTHESIS', source[charNumber++], lineNumber];
          break;
        case isCloseParenthesis(source, charNumber):
          console.log('closeparent');
          token = ['CLOSE_PARENTHESIS', source[charNumber++], lineNumber];
          break;
        case isDoubleQuote(source, charNumber):
          console.log('doublequote');
          charNumber++;
          while (!isDoubleQuote(source, charNumber)) {
            tokenValue += source[charNumber++];
          }
          charNumber++;
          token = ['STRING', String('"' + tokenValue + '"'), lineNumber];
          break;
        case isSemicolon(source, charNumber):
          console.log('semicolon');
          while (!isNewline(source, charNumber++)) {
            tokenValue += source[charNumber]  
          }
          token = ['COMMENT', tokenValue.trim(), lineNumber++];
          break;
        case isBoolean(source, charNumber):
          console.log('boolean');
          while (!isWhitespace(source, charNumber) && !isCloseParenthesis(source, charNumber)) {
            tokenValue += source[charNumber++];
          }
          token = ['BOOLEAN', Boolean(tokenValue), lineNumber];
          break;
        case isNumber(source, charNumber):
          console.log('number');
          while (!isWhitespace(source, charNumber) && !isCloseParenthesis(source, charNumber)) {
            tokenValue += source[charNumber++];
          }
          token = ['NUMBER', Number(tokenValue), lineNumber];
          break;
        default:
          console.log('other');
          while (!isWhitespace(source, charNumber) && !isCloseParenthesis(source, charNumber)) {
            // if (isQuestion(source, charNumber)) {
            //   tokenValue += '__bool';
            // } else if (isBang(source, charNumber)) {
            //   tokenValue += '__bang';
            // } else if (isDash(source, charNumber)) {
            //   tokenValue += (source[charNumber+1] === ' ') ? '-' : '_';
            // } else {
            //   tokenValue += source[charNumber];
            // }
            tokenValue += source[charNumber];
            charNumber += 1;
          }
          token = ['SYMBOL', String(tokenValue), lineNumber];
      }

      if (token.length === 3) tokens.push(token);
    }

    return tokens;
  };

  return lex(source);
};