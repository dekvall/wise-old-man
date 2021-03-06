import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import LineChart from '../../components/LineChart';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import fetchDetailsAction from '../../redux/modules/competitions/actions/fetchDetails';
import updateAllAction from '../../redux/modules/competitions/actions/updateAll';
import updatePlayerAction from '../../redux/modules/players/actions/track';
import { getCompetition, getChartData } from '../../redux/selectors/competitions';
import { getUpdatingUsernames } from '../../redux/selectors/players';
import CompetitionTable from './components/CompetitionTable';
import CompetitionInfo from './components/CompetitionInfo';
import TotalGainedWidget from './components/TotalGainedWidget';
import TopPlayerWidget from './components/TopPlayerWidget';
import CountdownWidget from './components/CountdownWidget';
import DeleteCompetitionPopup from './components/DeleteCompetitionPopup';
import './Competition.scss';

const TABS = ['Progress Table', 'Top 10 progress chart'];

function getMenuOptions(competition) {
  if (!competition) {
    return [];
  }

  if (competition.status === 'finished') {
    return [
      {
        label: 'Delete competition',
        value: 'delete'
      }
    ];
  }

  return [
    {
      label: 'Edit competition',
      value: 'edit'
    },
    {
      label: 'Delete competition',
      value: 'delete'
    }
  ];
}

function Competition() {
  const { id } = useParams();
  const router = useHistory();
  const dispatch = useDispatch();

  // State variables
  const [showingDeletePopup, setShowingDeletePopup] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Memoized redux variables
  const competition = useSelector(state => getCompetition(state, parseInt(id, 10)));
  const competitionChartData = useSelector(state => getChartData(state, parseInt(id, 10)));
  const updatingUsernames = useSelector(state => getUpdatingUsernames(state));

  const fetchDetails = () => {
    dispatch(fetchDetailsAction(id));
  };

  const handleUpdatePlayer = username => {
    dispatch(updatePlayerAction(username));
  };

  const handleUpdateAll = () => {
    dispatch(updateAllAction(id));
    setButtonDisabled(true);
  };

  const handleTabChanged = i => {
    setSelectedTabIndex(i);
  };

  const handleDeletePopupClosed = () => {
    setShowingDeletePopup(false);
  };

  const handleOptionSelected = option => {
    if (option.value === 'delete') {
      setShowingDeletePopup(true);
    } else {
      const URL = `/competitions/${competition.id}/${option.value}`;
      router.push(URL);
    }
  };

  // Memoized callbacks
  const onUpdatePlayer = useCallback(handleUpdatePlayer, [id, dispatch]);
  const onUpdateAllClicked = useCallback(handleUpdateAll, [id, dispatch]);
  const onOptionSelected = useCallback(handleOptionSelected, [router, competition]);
  const onTabChanged = useCallback(handleTabChanged, []);
  const onDeletePopupClosed = useCallback(handleDeletePopupClosed, []);

  const menuOptions = useMemo(() => getMenuOptions(competition), [competition]);

  // Fetch competition details, on mount
  useEffect(fetchDetails, [dispatch, id]);

  if (!competition) {
    return <Loading />;
  }

  return (
    <div className="competition__container container">
      <div className="competition__header row">
        <div className="col">
          <PageHeader title={competition.title}>
            {competition.status !== 'finished' && (
              <Button text="Update all" onClick={onUpdateAllClicked} disabled={isButtonDisabled} />
            )}
            <Dropdown options={menuOptions} onSelect={onOptionSelected}>
              <button className="header__options-btn" type="button">
                <img src="/img/icons/options.svg" alt="" />
              </button>
            </Dropdown>
          </PageHeader>
        </div>
      </div>
      <div className="competition__widgets row">
        <div className="col-md-4">
          <span className="widget-label">Time Remaining</span>
          <CountdownWidget competition={competition} />
        </div>
        <div className="col-md-4 col-sm-6">
          <span className="widget-label">Top Player</span>
          <TopPlayerWidget competition={competition} />
        </div>
        <div className="col-md-4 col-sm-6">
          <span className="widget-label">Total Gained</span>
          <TotalGainedWidget competition={competition} />
        </div>
      </div>
      <div className="competition__content row">
        <div className="col-md-4">
          <CompetitionInfo competition={competition} />
        </div>
        <div className="col-md-8">
          <Tabs tabs={TABS} onChange={onTabChanged} />
          {selectedTabIndex === 0 ? (
            <CompetitionTable
              competition={competition}
              updatingUsernames={updatingUsernames}
              onUpdateClicked={onUpdatePlayer}
            />
          ) : (
            <LineChart datasets={competitionChartData} />
          )}
        </div>
      </div>
      {showingDeletePopup && competition && (
        <DeleteCompetitionPopup competition={competition} onCancel={onDeletePopupClosed} />
      )}
    </div>
  );
}

export default Competition;
