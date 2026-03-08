export const Disclaimer = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 text-xs text-yellow-800">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p>
          Disclaimer: This web frontend is an experimental project created 100% by prompting the MiniMax M2.5 LLM, to test its capabilities. The backend code was artisanally crafted in 2019 and so was the <a href="https://play.google.com/store/apps/details?id=com.busytrack.openlivetrivia" target="_blank" rel="noopener noreferrer" className="text-primary underline">Android app</a>. Use the Android app if you want a more reliable experience with this game.
        </p>
      </div>
    </div>
  );
};
