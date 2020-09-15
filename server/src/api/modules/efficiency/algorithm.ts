import { Algorithm, BossMeta, Experiences, Killcounts, SkillMeta } from '../../../types';
// import mainBossingMetas from 'wom-rates/current/main/ehb.json';
// import mainSkillingMetas from 'wom-rates/current/main/ehp.json';

import mainBossingMetas from './ehb.json';
import mainSkillingMetas from './ehp.json';

// import * as ironBossingMetas from 'wom-rates/current/iron/ehb.json';
// import * as ironSkillingMetas from 'wom-rates/current/iron/ehp.json';

// import * as f2pBossingMetas from 'wom-rates/current/f2p/ehb.json';
// import * as f2pSkillingMetas from 'wom-rates/current/f2p/ehp.json';

// import * as lvl3BossingMetas from 'wom-rates/current/lvl3/ehb.json';
// import * as lvl3SkillingMetas from 'wom-rates/current/lvl3/ehp.json';

import {
  calculateBossEHB,
  calculateEHB,
  calculateMaxedEHP,
  calculateMaximumEHP,
  calculateTT200m
} from './util';

// const mainBossingMetas = require('wom-rates/current/main/ehb.json');
// const mainSkillingMetas = require('wom-rates/current/main/ehb.json');
class EfficiencyAlgorithm implements Algorithm {
  type: string;
  skillMetas: SkillMeta[];
  bossMetas: BossMeta[];
  maximumEHP: number;
  maxedEHP: number;

  constructor() {
    this.type = 'main';
    this.skillMetas = mainSkillingMetas.skills;
    this.bossMetas = mainBossingMetas.bosses;
    this.maximumEHP = this.calculateMaximumEHP();
    this.maxedEHP = this.calculateMaxedEHP();
  }

  calculateMaximumEHP(): number {
    return calculateMaximumEHP(this.skillMetas);
  }

  calculateMaxedEHP(): number {
    return calculateMaxedEHP(this.skillMetas);
  }

  calculateTTM(experiences: Experiences): number {
    return this.maxedEHP - this.calculateEHP(experiences);
  }

  calculateTT200m(experiences: Experiences): number {
    return calculateTT200m(experiences, this.skillMetas);
  }

  calculateEHP(experiences: Experiences): number {
    return this.maximumEHP - this.calculateTT200m(experiences);
  }

  calculateSkillEHP(skill: string, experiences: Experiences): number {
    return this.calculateTT200m({ ...experiences, [skill]: 0 }) - this.calculateTT200m(experiences);
  }

  calculateEHB(killcounts: Killcounts): number {
    return calculateEHB(killcounts, this.bossMetas);
  }

  calculateBossEHB(boss: string, killcounts: Killcounts) {
    return calculateBossEHB(boss, killcounts, this.bossMetas);
  }
}

export default new EfficiencyAlgorithm();
