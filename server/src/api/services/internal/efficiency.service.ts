import { Snapshot } from '../../../database/models';
import { BOSSES, SKILLS } from '../../constants';
import EfficiencyAlgorithm from '../../modules/efficiency/algorithms/algorithm';
import { getValueKey } from '../../util/metrics';

function calculateEHP(snapshot: Snapshot): number {
  const rateType = findRateType(snapshot);
  const algorithm = new EfficiencyAlgorithm(rateType);
  const exp = Object.fromEntries(SKILLS.map(s => [s, snapshot[getValueKey(s)]]));

  return algorithm.calculateEHP(exp);
}

function calculateEHB(snapshot: Snapshot) {
  const rateType = findRateType(snapshot);
  const algorithm = new EfficiencyAlgorithm(rateType);
  const kcs = Object.fromEntries(BOSSES.map(b => [b, snapshot[getValueKey(b)]]));

  return algorithm.calculateEHB(kcs);
}

function calculateEHPDiff(beforeSnapshot: Snapshot, afterSnapshot: Snapshot): number {
  return calculateEHP(afterSnapshot) - calculateEHP(beforeSnapshot);
}

function calculateEHBDiff(beforeSnapshot: Snapshot, afterSnapshot: Snapshot): number {
  return calculateEHB(afterSnapshot) - calculateEHB(beforeSnapshot);
}

function findRateType(snapshot: Snapshot) {
  return 'lvl3';
}

export { calculateEHP, calculateEHB, calculateEHBDiff, calculateEHPDiff };
