import React, { useEffect } from 'react';
import className from 'classnames';
import Button from '../../components/Button';
import './Home.scss';

const FEATURES = [
  {
    title: 'Player progress tracking',
    description: 'Track your progression overtime, browse your personal records and achievements.',
    image: '/img/landing_page/features/player_tracking.png'
  },
  {
    title: 'Efficiency metrics',
    description: "Measure your account's progress using updated effiency metrics.",
    image: '/img/landing_page/features/efficiency_metrics.png',
    unavailable: true
  },
  {
    title: 'Skill competitions',
    description: 'Compete against all your friends in any skill of your choosing.',
    image: '/img/landing_page/features/team_competitions.png'
  },
  {
    title: 'Global leaderboards',
    description: 'Browse or compete with the community in the global record/gained leaderboards.',
    image: '/img/landing_page/features/leaderboards.png'
  }
];

function Home() {
  function onScroll() {
    const { scrollY } = window;
    const hero = document.getElementById('hero');
    const intro = document.getElementById('intro');
    const illustration = document.getElementById('illustration');

    const scrollPercent = scrollY / (hero.offsetHeight * 0.6);

    intro.style.opacity = 1 - scrollPercent;
    intro.style.transform = `translateY(${scrollPercent * 50}px)`;

    illustration.style.opacity = 1 - scrollPercent;
    illustration.style.transform = `scale(${1 + scrollPercent * 0.05})`;
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home__container">
      <section id="hero" className="hero">
        <div id="intro" className="hero__intro">
          <div className="intro-container">
            <span className="intro-greeting">Hi, meet the</span>
            <h1 className="intro-title">Wise Old Man</h1>
            <p className="intro-description">
              The Open Source Old School Runescape player progress tracker.
            </p>
            <Button text="Contribute" url="https://github.com/psikoi/wise-old-man" />
          </div>
        </div>
        <div id="illustration" className="hero__illustration">
          <img src="/img/landing_page/hero_background.png" alt="" />
        </div>
      </section>
      <section className="about container">
        <div className="details row">
          <div className="details__info col-lg-7 col-md-12">
            <h1 className="section-title">What is it?</h1>
            <p className="description">
              The Wise Old Man is an Open source project, meaning anyone in the community can contribute
              code or ideas to add new functionality.
              <br />
              <br />
              This application measures Old School Runescape player progress. Built on top of the OSRS
              hiscores, it adds extra functionality like group competitions, player achievements,
              experience records, etc.
            </p>
            <div className="info-actions">
              <Button
                className="-github-btn"
                text="Contribute on Github"
                icon="/img/icons/github.svg"
                url="https://github.com/psikoi/wise-old-man"
              />
              <Button
                className="-discord-btn"
                text="Join our discord"
                icon="/img/icons/discord.svg"
                url="https://discord.gg/Ky5vNt2"
              />
              <Button
                className="-twitter-btn"
                text="Follow on Twitter"
                icon="/img/icons/twitter.svg"
                url="https://twitter.com/wise_old_man_rs"
              />
            </div>
          </div>
          <div className="details__stats col-lg-5">
            <img src="/img/landing_page/trophies.png" alt="" />
          </div>
        </div>
        <div className="features row">
          {FEATURES.map(({ unavailable, title, image, description }) => (
            <div
              key={title}
              className={className({ 'feature-card': true, '-unavailable': unavailable })}
            >
              <img className="feature-card__image" src={image} alt="" />
              <div className="feature-card__info">
                <b className="feature-title">{title}</b>
                {unavailable && <span className="unavailable-label">Coming soon</span>}
                <p className="feature-description">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
