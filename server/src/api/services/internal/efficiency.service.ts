import { Op } from 'sequelize';
import { Player, Snapshot } from '../../../database/models';
import { BOSSES, SKILLS } from '../../constants';
import mainAlgorithm from '../../modules/efficiency/algorithms/main';
import { getValueKey } from '../../util/metrics';

function calculateTTM(snapshot: Snapshot): number {
  // TODO: always use main ehp, for now
  const algorithm = mainAlgorithm;
  const exp = Object.fromEntries(SKILLS.map(s => [s, snapshot[getValueKey(s)]]));

  return Math.floor(algorithm.calculateTTM(exp) * 100000) / 100000;
}

function calculateTT200m(snapshot: Snapshot): number {
  // TODO: always use main ehp, for now
  const algorithm = mainAlgorithm;
  const exp = Object.fromEntries(SKILLS.map(s => [s, snapshot[getValueKey(s)]]));

  return Math.floor(algorithm.calculateTT200m(exp) * 100000) / 100000;
}

function calculateEHP(snapshot: Snapshot): number {
  // TODO: always use main ehp, for now
  const algorithm = mainAlgorithm;
  const exp = Object.fromEntries(SKILLS.map(s => [s, snapshot[getValueKey(s)]]));

  return Math.floor(algorithm.calculateEHP(exp) * 100000) / 100000;
}

function calculateEHB(snapshot: Snapshot) {
  // TODO: always use main ehp, for now
  const algorithm = mainAlgorithm;
  const kcs = Object.fromEntries(BOSSES.map(b => [b, snapshot[getValueKey(b)]]));

  return Math.floor(algorithm.calculateEHB(kcs) * 100000) / 100000;
}

function calculateEHPDiff(beforeSnapshot: Snapshot, afterSnapshot: Snapshot): number {
  return calculateEHP(afterSnapshot) - calculateEHP(beforeSnapshot);
}

function calculateEHBDiff(beforeSnapshot: Snapshot, afterSnapshot: Snapshot): number {
  return calculateEHB(afterSnapshot) - calculateEHB(beforeSnapshot);
}

async function getEHPRank(playerId: number, ehpValue: number): Promise<number> {
  const rank = await Player.count({
    where: {
      id: { [Op.not]: playerId },
      ehp: { [Op.gte]: ehpValue }
    }
  });

  return rank + 1;
}

async function getEHBRank(playerId: number, ehbValue: number): Promise<number> {
  const rank = await Player.count({
    where: {
      id: { [Op.not]: playerId },
      ehb: { [Op.gte]: ehbValue }
    }
  });

  return rank + 1;
}

export {
  calculateTTM,
  calculateTT200m,
  calculateEHP,
  calculateEHB,
  calculateEHBDiff,
  calculateEHPDiff,
  getEHPRank,
  getEHBRank
};
