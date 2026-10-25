interface LoginLogosProps {
  permission?: string;
}

export function LoginLogos({ permission }: LoginLogosProps) {
  return (
    <div className="flex justify-center items-center gap-8">
      {/* Show JoinTrim logo for permission 1 or 3 */}
      {/* {(permission === '1' || permission === '3') && ( */}
        {/* <img
          src="https://jointrim.com/wp-content/uploads/2024/07/JoinTrim-Logo-zoomed-1.png"
          alt="JoinTrim Logo"
          className="h-12 w-auto"
        /> */}
      {/* )} */}
     
    </div>
  );
}