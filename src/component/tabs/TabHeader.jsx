export default function TabHeader({
  data,
  setVisibleTab,
  visibleTab,
  buttonClass,
  buttonPosision,
}) {
  const fixedButtonClass =
    "w-full border-b-2 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 rounded flex flex-wrap ";

  return (
    <div>
      <nav>
        <div className={fixedButtonClass + buttonPosision}>
          {data.map((tab, index) => (
            <button
              key={index}
              className={`${buttonClass} bg-transparent hover:bg-slate-200 hover:text-gray-800 rounded-t-md
                                        py-2 px-4 mr-2  
                                        ${
                                          visibleTab === index
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                            : "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-500"
                                        }`}
              onClick={() => setVisibleTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
