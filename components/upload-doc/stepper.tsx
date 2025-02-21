
interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                index <= currentStep
                  ? "border-primary bg-[#3B016B] text-white"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-sm w-[100px] font-medium">{step}</p>
          </div>
        ))}
        <div className="absolute top-4 left-16 -z-10 h-[2px] w-[73%] sm:w-[80%] md:w-[84%] bg-gray-200">
          <div
            className="h-full bg-[#3B016B] transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

