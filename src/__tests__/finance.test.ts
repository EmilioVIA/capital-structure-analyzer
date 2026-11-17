import {describe,expect,it} from 'vitest';
import {afterTaxDebt,calculateScenario,calculateWacc,capm,validateInputs,type Inputs} from '../finance';
const base:Inputs={company:'Test Co.',total:1000,debt:400,equity:600,kd:10,ke:15,tax:30,beta:1.2,rf:5,marketReturn:10,method:'direct',currency:'MXN',unit:'unidades'};
describe('motor financiero',()=>{
 it('calcula el costo de deuda después de impuestos',()=>expect(afterTaxDebt(.1,.3)).toBeCloseTo(.07));
 it('calcula CAPM',()=>expect(capm(.05,1.2,.1)).toBeCloseTo(.11));
 it('calcula WACC con ponderaciones',()=>expect(calculateWacc(.4,.1,.15,.3)).toBeCloseTo(.118));
 it('en 0% deuda, WACC equivale a Ke',()=>expect(calculateScenario({id:'a',name:'sin deuda',debtPct:0,kd:10,ke:15},30,1000).wacc).toBeCloseTo(15));
 it('en 100% deuda, WACC equivale a Kd después de impuestos',()=>expect(calculateScenario({id:'b',name:'solo deuda',debtPct:100,kd:10,ke:15},30,1000).wacc).toBeCloseTo(7));
 it('evita división entre cero al mostrar apalancamiento infinito',()=>expect(calculateScenario({id:'b',name:'solo deuda',debtPct:100,kd:10,ke:15},30,1000).leverage).toBe(Infinity));
 it('valida que deuda y capital sumen el total',()=>expect(validateInputs(base)).toHaveLength(0));
 it('rechaza estructura que no cuadra',()=>expect(validateInputs({...base,equity:500})).toContain('La deuda más el capital propio deben coincidir con el capital total requerido.'));
});
