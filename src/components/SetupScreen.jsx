import { useMemo, useState } from "react";
import BrandPill from "./layout/BrandPill";
import SetupFooter from "./setup/SetupFooter";
import SetupSidebar from "./setup/SetupSidebar";
import SetupStepOptions from "./setup/SetupStepOptions";
import { MODE_ACCENTS, SETUP_STEPS } from "./setup/setupConstants";
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
  const modeAccent = MODE_ACCENTS[selectedMode.id] || MODE_ACCENTS.easy;

  const selectionChips = useMemo(
    () => [
      { key: "subject", value: selectedSubject.name, tone: selectedSubject.meta.badge },
      { key: "grade", value: selectedGrade.longLabel, tone: "ios-chip" },
      { key: "mode", value: selectedMode.name, tone: modeAccent.badge },
    ],
    [
      modeAccent.badge,
      selectedGrade.longLabel,
      selectedMode.name,
      selectedSubject.meta.badge,
      selectedSubject.name,
    ]
  );

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
    <div className="mx-auto flex h-full max-w-[1020px] items-center justify-center px-3 py-3">
      <section className="ios-surface grid h-full max-h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] rounded-[30px] px-4 py-4 sm:px-5 sm:py-5">
        <header className="flex items-center justify-between gap-3">
          <BrandPill />
          <ThemeSwitch checked={isDark} onToggle={onToggleTheme} />
        </header>

        <div className="mt-4 grid min-h-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SetupSidebar
            activeStep={activeStep}
            step={step}
            selectedSubject={selectedSubject}
            selectedGrade={selectedGrade}
            selectedMode={selectedMode}
            selectionChips={selectionChips}
          />

          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] rounded-[26px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-3 dark:bg-slate-950/24 sm:px-4 sm:py-4">
            <div className="min-h-0 overflow-y-auto pr-1">
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
