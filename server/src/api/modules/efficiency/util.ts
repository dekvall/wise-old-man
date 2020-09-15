import { BonusType, BossMeta, Experiences, Killcounts, SkillMeta, RichBonus } from '../../../types';
import { BOSSES, SKILLS, EXP_MAX, EXP_99 } from '../../constants';

function getBonuses(metas: SkillMeta[], type: BonusType): RichBonus[] {
  return metas
    .flatMap(meta => {
      const methods = meta.methods;
      const expStarts = methods.map(m => m.startExp);

      return methods.flatMap((m, i) =>
        m.bonuses.map(b => ({
          ...b,
          startExp: expStarts[i],
          endExp: expStarts[i + 1] || EXP_MAX,
          parent: meta.name
        }))
      );
    })
    .filter(b => b?.end === (type === BonusType.End));
}

function calculateBonuses(experiences: Experiences, bonuses: RichBonus[]) {
  // Creates an object with an entry for each bonus skill (0 bonus exp)
  const map = Object.fromEntries(bonuses.map(b => [b.name, 0]));

  bonuses.forEach(b => {
    const expCap = Math.min(b.endExp, EXP_MAX);
    const start = Math.max(experiences[b.parent], b.startExp);
    const target = b.parent in map ? expCap - map[b.parent] : expCap;

    map[b.name] += Math.max(0, target - start) * b.ratio;
  });
  return map;
}

function calculateMaximumEHP(metas: SkillMeta[]) {
  const zeroStats = Object.fromEntries(SKILLS.map(s => [s, 0]));
  const res = calculateTT200m(zeroStats, metas);
  console.log(`TTM is ${res} and should be 14,962`);
  return res;
}

function calculateMaxedEHP(metas: SkillMeta[]) {
  const zeroStats = Object.fromEntries(SKILLS.map(s => [s, 0]));
  const maxedStats = Object.fromEntries(SKILLS.map(s => [s, EXP_99]));
  return calculateTT200m(zeroStats, metas) - calculateTT200m(maxedStats, metas);
}

function calculateBossEHB(boss: string, killcounts: Killcounts, metas: BossMeta[]) {
  const kc = killcounts[boss];

  if (!kc || kc <= 0) return 0;

  const meta = metas.find(meta => meta.boss === boss);

  if (!meta || meta.rate <= 0) return 0;

  return kc / meta.rate;
}

function calculateEHB(killcounts: Killcounts, metas: BossMeta[]) {
  return BOSSES.map(b => calculateBossEHB(b, killcounts, metas)).reduce((a, c) => a + c);
}

function calculateTT200m(experiences: Experiences, metas: SkillMeta[]): number {
  const startBonusExp = calculateBonuses(experiences, getBonuses(metas, BonusType.Start));
  const endBonusExp = calculateBonuses(experiences, getBonuses(metas, BonusType.End));

  const startExps = Object.fromEntries(SKILLS.map(s => [s, experiences[s] + (startBonusExp[s] || 0)]));

  const targetExps = Object.fromEntries(
    SKILLS.map(s => [s, s in endBonusExp ? EXP_MAX - endBonusExp[s] : EXP_MAX])
  );
  console.log('======');

  const skillTimes = SKILLS.map(skill => {
    if (skill === 'overall') return 0;

    const methods = metas.find(sm => sm.name === skill)?.methods;
    const startExp = startExps[skill];
    const endExp = targetExps[skill];

    console.log(`skill: ${skill} start: ${startExp}, end: ${endExp}`);
    console.log(methods);

    // Handle 0 time skills (Hitpoints, Magic, Fletching)
    if (!methods || (methods.length === 1 && methods[0].rate === 0)) {
      return (endExp - startExp) / EXP_MAX;
    }

    let skillTime = 0;

    for (let i = 0; i < methods.length; i++) {
      const current = methods[i];
      const next = methods[i + 1];

      // Start exp is within this method's boundaries
      if (next && next.startExp > startExp && current.startExp < endExp) {
        const gained = Math.min(next.startExp, endExp) - Math.max(startExp, current.startExp);
        skillTime += Math.max(0, gained / current.rate);
      }

      // End exp is beyond this method's boundaries
      if (!next && endExp > current.startExp) {
        const gained = endExp - Math.max(current.startExp, startExp);
        skillTime += Math.max(0, gained / current.rate);
      }
    }

    return skillTime;
  });

  // Sum all individual skill times, into the total TTM
  return skillTimes.reduce((a, c) => a + c);
}

export {
  getBonuses,
  calculateBonuses,
  calculateTT200m,
  calculateMaximumEHP,
  calculateMaxedEHP,
  calculateEHB,
  calculateBossEHB
};
