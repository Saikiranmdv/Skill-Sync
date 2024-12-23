import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const RelevancyScoreComponent = ({ score }) => {
  return (
    <div style={{ width: '150px', margin: '0 auto' }}>
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textColor: '#000',
          pathColor: '#3e98c7',
          trailColor: '#d6d6d6',
        })}
      />
      <p style={{ textAlign: 'center', marginTop: '10px' }}>Relevancy Score</p>
    </div>
  );
};

export default RelevancyScoreComponent;
