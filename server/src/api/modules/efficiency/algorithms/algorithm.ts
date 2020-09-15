import { Algorithm, BossMeta, Experiences, Killcounts, SkillMeta } from '../../../../types';
import * as mainBossingMetas from 'wom-rates/current/main/ehb.json';
import * as mainSkillingMetas from 'wom-rates/current/main/ehp.json';

import * as ironBossingMetas from 'wom-rates/current/iron/ehb.json';
import * as ironSkillingMetas from 'wom-rates/current/iron/ehp.json';

import * as f2pBossingMetas from 'wom-rates/current/f2p/ehb.json';
import * as f2pSkillingMetas from 'wom-rates/current/f2p/ehp.json';

import * as lvl3BossingMetas from 'wom-rates/current/lvl3/ehb.json';
import * as lvl3SkillingMetas from 'wom-rates/current/lvl3/ehp.json';

import { calculateBossEHB, calculateEHB, calculateMaxEHP, calculateTTM } from '../util';

class EfficiencyAlgorithm implements Algorithm {
  type: string;
  skillMetas: SkillMeta[];
  bossMetas: BossMeta[];
  maxEHP: number;

  constructor(type: string) {
    this.type = type;
    this.skillMetas = mainSkillingMetas.skills;
    this.bossMetas = mainBossingMetas.bosses;
    this.maxEHP = this.calculateMaxEHP();
  }

  calculateMaxEHP(): number {
    return calculateMaxEHP(this.skillMetas);
  }

  calculateTTM(experiences: Experiences): number {
    return calculateTTM(experiences, this.skillMetas);
  }

  calculateEHP(experiences: Experiences): number {
    return this.maxEHP - this.calculateTTM(experiences);
  }

  calculateSkillEHP(skill: string, experiences: Experiences): number {
    return this.calculateTTM({ ...experiences, [skill]: 0 }) - this.calculateTTM(experiences);
  }

  calculateEHB(killcounts: Killcounts): number {
    return calculateEHB(killcounts, this.bossMetas);
  }

  calculateBossEHB(boss: string, killcounts: Killcounts) {
    return calculateBossEHB(boss, killcounts, this.bossMetas);
  }
}

export default EfficiencyAlgorithm;
