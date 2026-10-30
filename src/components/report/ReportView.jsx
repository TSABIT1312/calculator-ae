import React, { useState } from 'react';
import StepArea from './StepArea';
import StepStrategy from './StepStrategy';
import StepForm from './StepForm';
import StepCekLead from './StepCekLead';

export default function ReportView({ clusters, showToast, setLoader }) {
  const [step, setStep] = useState('area'); // 'area' | 'strategy' | 'form' | 'cek-lead'
  const [selectedArea, setSelectedArea] = useState('REGULER');

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setStep('strategy');
  };

  const handleGoToCekLead = () => {
    setStep('cek-lead');
  };

  const handleProceedToForm = () => {
    setStep('form');
  };

  const handleFormSubmitted = () => {
    setStep('area');
  };

  return (
    <div>
      {step === 'area' && (
        <StepArea
          onSelectArea={handleSelectArea}
          onGoToCekLead={handleGoToCekLead}
        />
      )}

      {step === 'strategy' && (
        <StepStrategy
          areaName={selectedArea}
          onBack={() => setStep('area')}
          onProceed={handleProceedToForm}
        />
      )}

      {step === 'form' && (
        <StepForm
          areaName={selectedArea}
          clusters={clusters}
          onBack={() => setStep('strategy')}
          onFormSubmitted={handleFormSubmitted}
          showToast={showToast}
          setLoader={setLoader}
        />
      )}

      {step === 'cek-lead' && (
        <StepCekLead
          onBack={() => setStep('area')}
          showToast={showToast}
          setLoader={setLoader}
        />
      )}
    </div>
  );
}

