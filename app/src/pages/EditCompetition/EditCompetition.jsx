import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import PageTitle from '../../components/PageTitle';
import TextInput from '../../components/TextInput';
import TextButton from '../../components/TextButton';
import Selector from '../../components/Selector';
import Button from '../../components/Button';
import DateRangeSelector from '../../components/DateRangeSelector';
import ParticipantsSelector from './components/ParticipantsSelector';
import ParticipantsPopup from './components/ParticipantsPopup';
import { capitalize, getSkillIcon } from '../../utils';
import { SKILLS } from '../../config';
import fetchDetailsAction from '../../redux/modules/competitions/actions/fetchDetails';
import editAction from '../../redux/modules/competitions/actions/edit';
import { getCompetition } from '../../redux/selectors/competitions';
import './EditCompetition.scss';

function getMetricOptions() {
  return [
    ...SKILLS.map(skill => ({
      label: capitalize(skill),
      icon: getSkillIcon(skill, true),
      value: skill
    }))
  ];
}

function EditCompetition() {
  const { id } = useParams();
  const router = useHistory();
  const dispatch = useDispatch();

  const metricOptions = useMemo(getMetricOptions, [SKILLS]);

  const today = useMemo(() => moment().startOf('day'), []);
  const initialStartMoment = useMemo(() => today.clone().add(1, 'days'), [today]);
  const initialEndMoment = useMemo(() => today.clone().add(8, 'days'), [today]);

  const [title, setTitle] = useState('');
  const [metric, setMetric] = useState(metricOptions[0].value);
  const [startDate, setStartDate] = useState(initialStartMoment.toDate());
  const [endDate, setEndDate] = useState(initialEndMoment.toDate());
  const [participants, setParticipants] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');

  const [showingImportPopup, toggleImportPopup] = useState(false);

  const competition = useSelector(state => getCompetition(state, parseInt(id, 10)));

  const metricIndex = useMemo(() => metricOptions.findIndex(o => o.value === metric), [
    metricOptions,
    metric
  ]);

  const fetchDetails = () => {
    dispatch(fetchDetailsAction(id));
  };

  const populate = () => {
    if (competition) {
      setTitle(competition.title);
      setMetric(competition.metric);
      setStartDate(competition.startsAt);
      setEndDate(competition.endsAt);
      setParticipants(competition.participants.map(p => p.username));
    }
  };

  const handleTitleChanged = e => {
    setTitle(e.target.value);
  };

  const handleMetricSelected = e => {
    setMetric((e && e.value) || null);
  };

  const handleDateRangeChanged = dates => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const handleAddParticipant = username => {
    setParticipants(p => (p.includes(username) ? p : [...p, username]));
  };

  const handleRemoveParticipant = username => {
    setParticipants(ps => [...ps.filter(p => p !== username)]);
  };

  const handleVerificationCodeChanged = e => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = {
      title,
      metric,
      startDate,
      endDate,
      participants,
      verificationCode
    };

    dispatch(editAction(competition.id, formData)).then(a => {
      if (a && a.competition) {
        router.push(`/competitions/${competition.id}`);
      }
    });
  };

  const handleImportPopupSubmit = usernames => {
    setParticipants(usernames);
    toggleImportPopup(false);
  };

  const hideParticipantsPopup = useCallback(() => toggleImportPopup(false), []);
  const showParticipantsPopup = useCallback(() => toggleImportPopup(true), []);

  const onTitleChanged = useCallback(handleTitleChanged, []);
  const onMetricSelected = useCallback(handleMetricSelected, []);
  const onDateRangeChanged = useCallback(handleDateRangeChanged, []);
  const onParticipantAdded = useCallback(handleAddParticipant, [participants]);
  const onParticipantRemoved = useCallback(handleRemoveParticipant, [participants]);
  const onVerificationCodeChanged = useCallback(handleVerificationCodeChanged, []);
  const onSubmitImportPopup = useCallback(handleImportPopupSubmit, []);
  const onSubmit = useCallback(handleSubmit, [
    title,
    metric,
    startDate,
    endDate,
    participants,
    verificationCode
  ]);

  // Fetch competition details, on mount
  useEffect(fetchDetails, [dispatch, id]);
  useEffect(populate, [competition]);

  return (
    <div className="edit-competition__container container">
      <div className="col">
        <PageTitle title="Edit competition" />

        <div className="form-row">
          <span className="form-row__label">Title</span>
          <TextInput
            value={title}
            placeholder="Ex: Varrock Titan's firemaking comp"
            onChange={onTitleChanged}
          />
        </div>

        <div className="form-row">
          <span className="form-row__label">Metric</span>
          <Selector
            options={metricOptions}
            onSelect={onMetricSelected}
            selectedIndex={metricIndex}
          />
        </div>

        <div className="form-row">
          <span className="form-row__label">Time range</span>
          <DateRangeSelector start={startDate} end={endDate} onRangeChanged={onDateRangeChanged} />
        </div>

        <div className="form-row">
          <hr />
        </div>

        <div className="form-row">
          <span className="form-row__label">
            Participants
            <span className="form-row__label-info">{`(${participants.length} selected)`}</span>
            <TextButton text="Import list" onClick={showParticipantsPopup} />
          </span>

          <ParticipantsSelector
            participants={participants}
            onParticipantAdded={onParticipantAdded}
            onParticipantRemoved={onParticipantRemoved}
          />
        </div>

        <div className="form-row">
          <span className="form-row__label">Verification code</span>
          <TextInput
            type="password"
            placeholder="Ex: 123-456-789"
            onChange={onVerificationCodeChanged}
          />
        </div>

        <div className="form-row form-actions">
          <Button text="Confirm" onClick={onSubmit} />
        </div>
      </div>
      {showingImportPopup && (
        <ParticipantsPopup onClose={hideParticipantsPopup} onConfirm={onSubmitImportPopup} />
      )}
    </div>
  );
}

export default EditCompetition;
