export const Modal = (props) => {
    if (!props.isOpen) return null;
  
    return (
      <>
     
        <div
          className="w-screen h-screen top-0 fixed bg-white/50 flex items-center justify-center h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              props.toggle(); 
            }
          }}
        >
       
          <div className="text-center bg-white-500 flex flex-col items-center justify-center">
            <header className="w-full">
              <div className="flex flex-row justify-between w-full p-2">
                <h1 className="text-xl font-bold">{props.headerLabel}</h1>
                <button aria-label="Close" onClick={props.toggle}>X</button>
              </div>
            </header>
            {props.children}
          </div>
        </div>
      </>
    );
  };
  