const steps = ["OPEN", "ASSIGNED", "IN_PROGRESS", "CLOSED"];

export default function StatusTimeline({ currentStatus }) {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center mb-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center w-full">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
              ${
                index <= currentIndex
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-500"
              }
            `}
          >
            {index + 1}
          </div>

          <span className="ml-2 mr-4 text-xs whitespace-nowrap">
            {step.replace("_", " ")}
          </span>

          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index < currentIndex
                  ? "bg-slate-900"
                  : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
