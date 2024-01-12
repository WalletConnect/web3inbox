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
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 7.08301C10.4808 7.08301 9.25 8.31379 9.25 9.83301C9.25 10.2472 9.58579 10.583 10 10.583C10.4142 10.583 10.75 10.2472 10.75 9.83301C10.75 9.14222 11.3092 8.58301 12 8.58301C12.6908 8.58301 13.25 9.14222 13.25 9.83301C13.25 10.2387 13.0384 10.477 12.5922 10.7778C12.0379 11.1504 11.25 11.7891 11.25 13V13.25C11.25 13.6642 11.5858 14 12 14C12.4142 14 12.75 13.6642 12.75 13.25V13C12.75 12.5773 12.9717 12.33 13.4293 12.0225L13.4302 12.0219C13.9717 11.6569 14.75 11.0272 14.75 9.83301C14.75 8.31379 13.5192 7.08301 12 7.08301ZM12 17.25C12.5523 17.25 13 16.8023 13 16.25C13 15.6977 12.5523 15.25 12 15.25C11.4477 15.25 11 15.6977 11 16.25C11 16.8023 11.4477 17.25 12 17.25Z"
          fill="black"
          strokeWidth="0"
        />
      </g>
      <defs>
        <clipPath id="clip0_268_422">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CircleQuestionIcon
