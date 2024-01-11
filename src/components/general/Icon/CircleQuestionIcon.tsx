const CircleQuestionIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
      className={props.className}
    >
      <g clip-path="url(#clip0_268_422)">
        <path
          d="M12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21Z"
          stroke="black"
          stroke-width="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13.25V13C12 12.183 12.505 11.74 13.011 11.4C13.505 11.067 14 10.633 14 9.83301C14 8.72801 13.105 7.83301 12 7.83301C10.895 7.83301 10 8.72801 10 9.83301"
          stroke="black"
          stroke-width="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="16.25" r="1" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_268_422">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CircleQuestionIcon
