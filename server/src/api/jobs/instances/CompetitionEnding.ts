import { onCompetitionEnding } from '../../events/competition.events';
import metricsService from '../../services/external/metrics.service';
import * as competitionService from '../../services/internal/competition.service';
import { Job } from '../index';

class CompetitionEnding implements Job {
  name: string;

  constructor() {
    this.name = 'CompetitionEnding';
  }

  async handle(data: any): Promise<void> {
    const { competitionId, minutes } = data;
    const endTimer = metricsService.trackJobStarted();

    try {
      const competition = await competitionService.resolve(competitionId, { includeGroup: true });

      if (!competition) return;

      // Double check the competition is ending, since the
      // competition start date can be changed between the
      // scheduling and execution of this job
      if (Math.abs(Date.now() - (competition.endsAt.getTime() - minutes * 60 * 1000)) > 10000) {
        return;
      }

      const competitionDetails = await competitionService.getDetails(competition);
      const period = minutes < 60 ? { minutes } : { hours: minutes / 60 };
      await onCompetitionEnding(competitionDetails, period);

      metricsService.trackJobEnded(endTimer, this.name, 1);
    } catch (error) {
      metricsService.trackJobEnded(endTimer, this.name, 0);
      throw error;
    }
  }
}

export default new CompetitionEnding();
