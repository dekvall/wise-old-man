import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import TableList from '../../../../components/TableList';
import StatusDot from '../../../../components/StatusDot';
import { getSkillIcon } from '../../../../utils';

function convertStatus(status) {
  switch (status) {
    case 'upcoming':
      return 'NEUTRAL';
    case 'ongoing':
      return 'POSITIVE';
    case 'finished':
      return 'NEGATIVE';
    default:
      return null;
  }
}

const TABLE_CONFIG = {
  uniqueKey: row => row.id,
  columns: [
    {
      key: 'metric',
      width: 30,
      transform: value => <img src={getSkillIcon(value)} alt="" />
    },
    { key: 'title', className: () => '-primary' },
    { key: 'duration' },
    {
      key: 'status',
      width: 250,
      transform: (value, row) => (
        <div className="status-cell">
          <StatusDot status={convertStatus(value)} />
          <span>{row && row.countdown}</span>
        </div>
      )
    }
  ]
};

function PlayerCompetitionsTable({ competitions }) {
  const router = useHistory();
  const order = ['ongoing', 'upcoming', 'finished'];
  const rows = competitions ? _.sortBy(competitions, c => _.indexOf(order, c.status)) : [];

  const handleRowClicked = index => {
    router.push(`/competitions/${rows[index].id}`);
  };

  const onRowClicked = useCallback(handleRowClicked, [router, competitions]);

  return (
    <TableList
      uniqueKeySelector={TABLE_CONFIG.uniqueKey}
      rows={rows}
      columns={TABLE_CONFIG.columns}
      clickable
      onRowClicked={onRowClicked}
    />
  );
}

PlayerCompetitionsTable.propTypes = {
  competitions: PropTypes.arrayOf(PropTypes.shape).isRequired
};

export default React.memo(PlayerCompetitionsTable);
