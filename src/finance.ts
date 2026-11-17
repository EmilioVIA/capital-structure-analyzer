export type Scenario = { id:string; name:string; debtPct:number; kd:number; ke:number; note?:string };
export type Inputs = { company:string; total:number; debt:number; equity:number; kd:number; ke:number; tax:number; beta:number; rf:number; marketReturn:number; method:'direct'|'capm'; currency:string; unit:string };
export type Result = Scenario & { equityPct:number; afterTaxKd:number; wacc:number; leverage:number; debtCost:number; equityCost:number };
export const clampRate=(n:number)=>Math.max(0,Math.min(1,n));
export function capm(rf:number,beta:number,marketReturn:number){return rf+beta*(marketReturn-rf)}
export function afterTaxDebt(kd:number,tax:number){return kd*(1-tax)}
export function calculateWacc(debtPct:number,kd:number,ke:number,tax:number){const d=debtPct,e=1-d;return d*afterTaxDebt(kd,tax)+e*ke}
export function calculateScenario(s:Scenario,tax:number,total:number):Result{
 const d=clampRate(s.debtPct/100), e=1-d, kd=s.kd/100, ke=s.ke/100, at=afterTaxDebt(kd,tax/100), w=calculateWacc(d,kd,ke,tax/100);
 return {...s,equityPct:e*100,afterTaxKd:at*100,wacc:w*100,leverage:e>0?(d/e):Infinity,debtCost:total*d*at,equityCost:total*e*ke};
}
export function validateInputs(i:Inputs){const errors:string[]=[];if(!i.company.trim())errors.push('Ingresa el nombre de la empresa.');if(!Number.isFinite(i.total)||i.total<=0)errors.push('El capital total requerido debe ser mayor que cero.');if(i.debt<0||i.equity<0)errors.push('Deuda y capital propio no pueden ser negativos.');if(Math.abs(i.debt+i.equity-i.total)>Math.max(0.01,i.total*0.0001))errors.push('La deuda más el capital propio deben coincidir con el capital total requerido.');if(i.tax<0||i.tax>100)errors.push('La tasa fiscal debe estar entre 0% y 100%.');if(i.kd<0||i.ke<0)errors.push('Las tasas de financiamiento no pueden ser negativas.');if(i.method==='capm'&&(i.rf<0||i.marketReturn<0||i.beta<0))errors.push('Los parámetros CAPM deben ser valores no negativos.');return errors;}
export const defaultScenarios=(kd:number,ke:number):Scenario[]=>[
 {id:'s1',name:'100% capital propio',debtPct:0,kd,ke}, {id:'s2',name:'25% deuda · 75% capital',debtPct:25,kd:kd+0.2,ke:ke+0.3}, {id:'s3',name:'50% deuda · 50% capital',debtPct:50,kd:kd+0.7,ke:ke+1.1}, {id:'s4',name:'75% deuda · 25% capital',debtPct:75,kd:kd+1.8,ke:ke+2.8}, {id:'s5',name:'100% deuda',debtPct:100,kd:kd+3.5,ke:ke+4.5}
];
