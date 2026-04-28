import { useState } from "react";
import BrandPill from "./layout/BrandPill";
import SetupFooter from "./setup/SetupFooter";
import SetupSidebar from "./setup/SetupSidebar";
import SetupStepOptions from "./setup/SetupStepOptions";
import { SETUP_STEPS } from "./setup/setupConstants";
import ThemeSwitch from "./ThemeSwitch";

export default function SetupScreen({
  subjectCards,
  grades,
  modes,
  selectedSubject,
  selectedGrade,
  selectedMode,
  isDark,
  onToggleTheme,
  onSelectSubject,
  onSelectGrade,
  onSelectMode,
  onStart,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const step = SETUP_STEPS[activeStep] || SETUP_STEPS[0];
  const isLastStep = activeStep === SETUP_STEPS.length - 1;

  const goPrev = () => setActiveStep((current) => Math.max(current - 1, 0));
  const goNext = () => setActiveStep((current) => Math.min(current + 1, SETUP_STEPS.length - 1));

  const handleSubjectSelect = (subjectName) => {
    onSelectSubject(subjectName);
    setActiveStep(1);
  };

  const handleGradeSelect = (gradeId) => {
    onSelectGrade(gradeId);
    setActiveStep(2);
  };

  return (
    <div className="mx-auto flex h-full max-w-[1280px] items-center justify-center px-2 py-2 sm:px-3 sm:py-3">
      <section className="ios-surface animate-fade-up grid h-full max-h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] rounded-2xl px-3 py-3 sm:px-4 sm:py-4">
        <header className="flex items-center justify-between gap-3">
          <BrandPill />
          <ThemeSwitch checked={isDark} onToggle={onToggleTheme} />
        </header>

        <div className="mt-2 grid min-h-0 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
          <SetupSidebar
            activeStep={activeStep}
            step={step}
          />

          <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-soft)] dark:bg-[color:var(--surface-strong)] sm:px-3.5 sm:py-3.5">
            <div className="mb-2 grid gap-1.5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--accent-strong)]">
                  Paso {activeStep + 1}
                </p>
                <h2 className="display-font mt-1 text-[1.8rem] font-extrabold leading-[0.95] sm:text-[2.15rem]">
                  {step.title}
                </h2>
              </div>
              <p className="max-w-[28ch] text-[13px] leading-5 text-[color:var(--text-secondary)] lg:justify-self-end">
                {step.hint}
              </p>
            </div>

            <div className="min-h-0 overflow-hidden">
              <SetupStepOptions
                step={step}
                subjectCards={subjectCards}
                grades={grades}
                modes={modes}
                selectedSubject={selectedSubject}
                selectedGrade={selectedGrade}
                selectedMode={selectedMode}
                onSelectSubject={handleSubjectSelect}
                onSelectGrade={handleGradeSelect}
                onSelectMode={onSelectMode}
              />
            </div>

            <SetupFooter
              activeStep={activeStep}
              totalSteps={SETUP_STEPS.length}
              isLastStep={isLastStep}
              onPrev={goPrev}
              onNext={goNext}
              onStart={onStart}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
