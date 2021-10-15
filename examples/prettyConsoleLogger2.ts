/** @format */

import {logLevel} from '../index.ts';
const { INFO, ERROR, WARN, DEBUG, DEMO } = logLevel

const chars = {
  singleLine: '▪',
  startLine: '┏',
  line: '┃',
  endLine: '┗',
};

const colors = {
  darkRed: '31m',
  darkGreen: '32m',
  darkYellow: '33m',
  darkBlue: '34m',
  red: '91m',
  green: '92m',
  yellow: '93m',
  blue: '94m',
  gray: '90m',
  magenta: '95m',
  cyan: '96m',
};

const color = (colorCode: string, text: string) => '\x1B[' + `${colorCode}${text}` + '\x1B[0m';
const getColorAndFunctionByLevel = (level: number) => {
  switch (level) {
    case INFO:
      return {
        colorCode: colors.green,
        logFunction: console.info,
      };
    case ERROR:
      return {
        colorCode: colors.red,
        logFunction: console.error,
      };
    case WARN:
      return {
        colorCode: colors.yellow,
        logFunction: console.warn,
      };
    case DEBUG:
      return {
        colorCode: colors.blue,
        logFunction: console.log,
      };
    case DEMO:
      return {
        colorCode: colors.cyan,
        logFunction: console.info
      }
  }
};

const createTag = (label: string, colorCode: string) => (text: string) =>
  `${color(colorCode, `${label.toLowerCase()}: `.padEnd(7))}${text}`;

const createNumber = (size: number, colorCode: string) => (number: number) =>
  `${color(colorCode, `[${String(number).padStart(size)}]`)}`;

const colorJsonComponent = (colorCode: string, s: string) => {
  const [key, value] = s.split('":');
  const hasComma = /,$/.test(value);
  const colorized = hasComma
    ? `${color(colorCode, value.replace(/,$/, ''))},`
    : color(colorCode, value);

  return `${key}":${colorized}`;
};

const highlightJsonString = (s: string) => {
  if (/:\s"/.test(s)) {
    return colorJsonComponent(colors.green, s);
  }

  if (/:\s\d+/.test(s)) {
    return colorJsonComponent(colors.magenta, s);
  }

  if (/:\s(true|false)/.test(s)) {
    return colorJsonComponent(colors.cyan, s);
  }

  return s;
};

const PrettyConsoleLogger2 =
  (_logLevel: any) =>
  ({ namespace, level, label, log }: any) => {
    const output = [];
    const { message, ...extra } = log;
    const prefix = namespace ? `[${namespace}] ` : '';
    const isSingleLine = !extra;
    const { colorCode, logFunction } : any = getColorAndFunctionByLevel(level);
    const tag = createTag(label, colorCode);

    if (isSingleLine) {
      output.push(color(colorCode, `${chars.singleLine} ${prefix}${message}`));
    } else {
      output.push(color(colorCode, `${chars.startLine} ${prefix}${message}`));
      const jsonItems = JSON.stringify(extra, null, 2).split('\n');
      const number = createNumber(String(jsonItems.length).length, colors.gray);
      const lastItem = jsonItems.pop();
      output.push(
        ...jsonItems.map(
          (s, i) =>
            `${color(colorCode, chars.line)} ${number(i)} ${highlightJsonString(
              s
            )}`
        )
      );
      output.push(
        `${color(colorCode, chars.endLine)} ${number(
          jsonItems.length
        )} ${lastItem}`
      );
    }

    logFunction(output.map(tag).join('\n'));
  };

export default PrettyConsoleLogger2;
