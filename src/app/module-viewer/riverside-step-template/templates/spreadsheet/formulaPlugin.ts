import * as Handsontable from 'handsontable';
import * as HotFormula from 'hot-formula-parser';
import * as Numbro from 'numbro';
import { HotNumericFormat } from './spreadsheet.component';

const parser = new HotFormula.Parser();

type TableData = (string | number)[][];

function replaceSUMRangesWithAdditions(valuesWithFormulas: TableData) {
  return valuesWithFormulas.map(row => row.map((cell: string) => {
    if (typeof cell === 'string') {
      const matches = cell.match(/SUM\([A-Z][0-9]+\:[A-Z][0-9]+\)/g) || [];
      matches.forEach(sum => {
        const [from, to] = sum.slice(4, -1).split(':');

        const idxFrom = Number(from.substr(1));
        const idxTo = Number(to.substr(1));
        const rowRange = Array(idxTo - idxFrom + 1).fill(0).map((_, i) => String(idxFrom + i));

        const colFrom = from.charCodeAt(0);
        const colRange = Array(to.charCodeAt(0) - colFrom + 1).fill(0).map((_, i) => String.fromCharCode(colFrom + i));

        const range = colRange.reduce((refs, col) => refs.concat(rowRange.map(row => col + row)), []);

        cell = cell.split(sum).join(range.join('+'));
      })
    }

    return cell;
  }));
}

function applyBasicCalculations(valuesWithFormulas: TableData) {
  function getValue(cellAddress) {
    return valuesWithFormulas[Number(cellAddress.substr(1)) - 1][cellAddress.charCodeAt(0) - 'A'.charCodeAt(0)];
  }

  return valuesWithFormulas.map(row => row.map(cell => {
    if (typeof cell === 'string') {
      if (cell[0] === '=') {
        (cell.match(/[A-Z][0-9]+/g) || []).forEach(ref => {
          const refVal = getValue(ref);
          if (typeof refVal === 'number' || '' === refVal || null === refVal) {
            cell = (cell as string).split(new RegExp(ref + '(?![0-9])', 'g')).join(String(Number(refVal)));
          }
        });

        // calculate the result when all cell references have been replaced by numbers
        if (!cell.match(/[A-Z][0-9]/)) {
          cell = parser.parse(cell.substr(1)).result;
        }
      }

      if (typeof cell === 'string' && !isNaN(parseFloat(cell))) {
        cell = parseFloat(cell);
      }
    }

    return cell;
  }));
}

function calculateValues(valuesWithFormulas) {
  // replace SUM ranges with simple additions, for example, SUM(A1:A3) becomes A1+A2+A3
  let values = replaceSUMRangesWithAdditions(valuesWithFormulas) as TableData;

  // repeatedly apply cell calculations until all cell references have been replaced by calculated values
  let previousResult = '';
  while (JSON.stringify(values) !== previousResult) {
    previousResult = JSON.stringify(values);
    values = applyBasicCalculations(values);
  }

  return values;
}

export function FormulaPlugin(hotInstance) {
  // Call the BasePlugin constructor.
  // @ts-ignore
  Handsontable.plugins.BasePlugin.call(this, hotInstance);

  this._superClass = Handsontable.plugins.BasePlugin;
}

// Inherit the BasePlugin prototype.
// @ts-ignore
FormulaPlugin.prototype = Object.create(Handsontable.plugins.BasePlugin.prototype, {
  constructor: {
    writable: true,
    configurable: true,
    value: FormulaPlugin
  },
});

// Enable plugin for all instances
FormulaPlugin.prototype.isEnabled = () => true;

FormulaPlugin.prototype.enablePlugin = function() {
  let values: TableData;

  this.addHook('beforeRender', (isForced: boolean, skipRender: object) => {
    values = calculateValues(this.hot.getData());
  });

  this.addHook('beforeValidate',
    (value: any, row: number, prop: string | number, source?: string) => values[row][prop]
  );

  this.addHook('beforeValueRender',
    (value: any, cellProperties: {row: number, col: number, numericFormat: HotNumericFormat}) => {
      if (value[0] !== '=') {
        return value;
      }

      const calculated = values[cellProperties.row][cellProperties.col];

      if (typeof calculated === 'string') {
        return calculated;
      }

      if (cellProperties.numericFormat) {
        return Numbro.default(Number(calculated)).format(cellProperties.numericFormat.pattern);
      } else {
        return calculated;
      }
    }
  );

  // The super class' method assigns the this.enabled property to true, which can be later used to check if plugin is already enabled.
  this._superClass.prototype.enablePlugin.call(this);
};

// @ts-ignore
Handsontable.plugins.registerPlugin('formulaPlugin', FormulaPlugin);