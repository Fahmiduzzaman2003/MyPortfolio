import { motion } from "framer-motion";

// --- SVG DEFINITIONS (Kept exactly as you provided) ---
const techLogos = [
  {
    name: "Python",
    color: "#3776AB",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
          <stop offset="0" stopColor="#5A9FD4"/>
          <stop offset="1" stopColor="#306998"/>
        </linearGradient>
        <linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
          <stop offset="0" stopColor="#FFD43B"/>
          <stop offset="1" stopColor="#FFE873"/>
        </linearGradient>
        <path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/>
        <path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/>
      </svg>
    ),
  },
  {
    name: "JavaScript",
    color: "#F7DF1E",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#F7DF1E" d="M2 1v125h125V1H2zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065C58.433 78.073 58.48 68 58.48 58h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-11.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-1.38 10.581z"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#3178C6" d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1A23 23 0 0180 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82.61 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10-.12 22-.1h21.81z"/>
      </svg>
    ),
  },
  {
    name: "React",
    color: "#61DAFB",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <g fill="#61DAFB">
          <circle cx="64" cy="64" r="11.4"/>
          <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/>
        </g>
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#339933",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#339933" d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623c-.712 0-2.306 1.061-2.306 1.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073zM77.91 81.445c-11.726 0-14.309-3.235-15.17-9.066-.1-.628-.633-1.379-1.272-1.379h-5.731c-.709 0-1.279.86-1.279 1.566 0 7.466 4.059 16.512 23.453 16.512 14.039 0 22.088-5.455 22.088-15.109 0-9.572-6.467-12.084-20.082-13.886-13.762-1.819-15.16-2.738-15.16-5.962 0-2.658 1.184-6.203 11.374-6.203 9.105 0 12.461 1.954 13.842 8.091.118.577.645 1.06 1.24 1.06h5.754c.354 0 .692-.286.94-.556.24-.277.186-.605.143-.854-1.18-14.29-10.56-20.6-21.919-20.6-12.442 0-19.872 5.455-19.872 14.578 0 9.885 7.668 12.615 20.015 13.817 14.775 1.445 15.377 3.593 15.377 6.49 0 5.049-4.015 7.5-13.74 7.5z"/>
      </svg>
    ),
  },
  {
    name: "C++",
    color: "#00599C",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#00599C" d="M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.3.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6zm-53.5 70c-21.8 0-39.5-17.7-39.5-39.5S42.2 24.5 64 24.5c14.7 0 27.5 8.1 34.3 20l-13 7.5C81.1 44.5 73.1 39.5 64 39.5c-13.5 0-24.5 11-24.5 24.5s11 24.5 24.5 24.5c9.1 0 17.1-5 21.3-12.4l12.9 7.6c-6.8 11.8-19.6 19.8-34.2 19.8zM115 62h-3.2l-1.4 3h-4.3l-1.4-3H101v-3h14v3zm-19 3h-3.2l-1.4 3h-4.3l-1.4-3H82v-3h14v3z"/>
      </svg>
    ),
  },
  {
    name: "Java",
    color: "#ED8B00",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#ED8B00" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
        <path fill="#ED8B00" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
        <path fill="#ED8B00" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
        <path fill="#ED8B00" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
        <path fill="#ED8B00" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
      </svg>
    ),
  },
  {
    name: "HTML5",
    color: "#E34F26",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#E34F26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/>
        <path fill="#EF652A" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/>
        <path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"/>
        <path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"/>
      </svg>
    ),
  },
  {
    name: "CSS3",
    color: "#1572B6",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#1572B6" d="M19.67 26l8.069 90.493 36.206 10.05 36.307-10.063L108.33 26H19.67zm69.21 50.488l-2.35 21.892.009 1.875L64 106.55v.001l-.018.015-22.719-6.225L39.726 83h11.141l.79 8.766 12.347 3.295-.004.015v-.032l12.394-3.495L77.702 77H51.76l-.164-3.037-.142-1.475-.206-3.488h27.886l.58-6h-29.29l-.515-6H78.13l.706-8H49.579l-.147-1.49-.217-3.508-.143-2.002H79.27z"/>
      </svg>
    ),
  },
  {
    name: "Git",
    color: "#F05032",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#F05032" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/>
      </svg>
    ),
  },
  {
    name: "Docker",
    color: "#2496ED",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#2496ED" d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.1-3.5 8.3-3.1 12.3.3 2.9 1.2 5.9 3 8.3-1.4.8-2.9 1.9-4.3 2.4-2.8 1-5.9 2-8.9 2H79V49H66V24H41v12H28v13H7.8c-2.5 0-4.6 2-4.7 4.5v.2c-.7 11.4 4.5 22.8 14.2 30.7 11.8 9.2 27.3 12.5 42.4 9.6 12.4-2.3 24.3-7.6 33.2-16.1 6.9-6.7 12-15.1 15.2-24.4H116c5.9 0 12.2-2.2 15.1-7.7l.8-1.5-1.1-.7z"/>
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    color: "#336791",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#336791" d="M93.809 92.112c.785-6.533.55-7.492 5.416-6.433l1.235.108c3.742.17 8.637-.602 11.513-1.938 6.191-2.873 9.861-7.668 3.758-6.409-13.924 2.873-14.881-1.842-14.881-1.842 14.703-21.815 20.849-49.508 15.543-56.287-14.47-18.489-39.517-9.746-39.936-9.52l-.134.025c-2.751-.571-5.83-.912-9.289-.968-6.301-.104-11.082 1.652-14.709 4.402 0 0-44.683-18.409-42.604 23.151.442 8.841 12.672 66.898 27.26 49.362 5.332-6.412 10.484-11.834 10.484-11.834 2.558 1.699 5.622 2.567 8.834 2.255l.249-.212c-.078.796-.044 1.575.099 2.497-3.757 4.199-2.653 4.936-10.166 6.482-7.602 1.566-3.136 4.355-.221 5.084 3.535.884 11.712 2.136 17.238-5.598l-.22.882c1.474 1.18 1.375 8.477 1.583 13.69.209 5.214.558 10.079 1.621 12.948 1.063 2.868 2.317 10.256 12.191 8.14 8.252-1.764 14.561-4.309 15.136-27.96"/>
        <path fill="#fff" d="M66.509 83.302c.157 1.256.296 2.357.367 3.258.106 1.357.159 2.612.183 3.799 1.006-.217 2.035-.393 3.076-.53-.035-1.198-.138-2.47-.326-3.845-.207-1.516-.488-3.14-.869-4.912-1.009.277-1.656.568-2.431.23"/>
      </svg>
    ),
  },
  {
    name: "MySQL",
    color: "#4479A1",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#4479A1" d="M2.001 90.458h4.108v-16.223l6.36 14.143c.75 1.712 1.777 2.317 3.792 2.317s3.003-.605 3.753-2.317l6.36-14.143v16.223h4.108V74.235c0-2.073-.624-3.45-2.062-4.256-1.438-.806-3.753-.806-5.438 0-1.686.807-3.003 2.317-3.753 3.905l-5.438 11.825-5.437-11.825c-.75-1.588-2.067-3.098-3.753-3.905-1.686-.806-4-.806-5.438 0-1.437.806-2.062 2.183-2.062 4.256v16.223z"/>
        <path fill="#4479A1" d="M45.001 90.458h4.108V83.03c0-2.073.624-3.45 2.062-4.256 1.438-.806 3.753-.806 5.438 0 1.686.807 2.062 2.183 2.062 4.256v7.428h4.108V82.295c0-2.073-.624-3.45-2.062-4.256-1.438-.806-3.753-.806-5.438 0-1.686.807-3.003 2.317-3.753 3.905l-.624-3.173h-3.878c-.312 1.588-.312 3.177-.312 4.765v7.922h-.711z"/>
        <path fill="#4479A1" d="M86.498 75.508c-2.062-1.713-5.065-2.453-8.068-2.453s-5.694.74-7.443 2.319c-1.749 1.579-2.686 3.858-2.686 6.735 0 2.877.937 5.156 2.686 6.735 1.749 1.579 4.129 2.319 7.132 2.319s5.694-.74 7.443-2.319c1.749-1.579 2.686-3.858 2.686-6.735s-.937-5.156-2.75-6.601zm-11.817 10.559c-.937-.94-1.437-2.452-1.437-4.525s.5-3.585 1.437-4.525c.937-.94 2.374-1.446 4.129-1.446s3.191.507 4.129 1.446c.937.94 1.437 2.452 1.437 4.525s-.5 3.585-1.437 4.525c-.937.94-2.374 1.446-4.129 1.446s-3.192-.506-4.129-1.446z"/>
        <path fill="#4479A1" d="M107.497 90.458h4.108V83.03c0-2.073.624-3.45 2.062-4.256 1.438-.806 3.753-.806 5.438 0 1.686.807 2.062 2.183 2.062 4.256v7.428h4.108V82.295c0-2.073-.624-3.45-2.062-4.256-1.438-.806-3.753-.806-5.438 0-1.686.807-3.003 2.317-3.753 3.905l-.624-3.173h-3.878c-.312 1.588-.312 3.177-.312 4.765v7.922h-.711z"/>
      </svg>
    ),
  },
  {
    name: "Lovable",
    color: "#FF6B9D",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="lovable-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D"/>
            <stop offset="100%" stopColor="#C44569"/>
          </linearGradient>
        </defs>
        <path fill="url(#lovable-gradient)" d="M64 20c-8.284 0-15 6.716-15 15 0 8.284-6.716 15-15 15-8.284 0-15 6.716-15 15s6.716 15 15 15c8.284 0 15 6.716 15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284 6.716-15 15-15 8.284 0 15-6.716 15-15s-6.716-15-15-15c-8.284 0-15-6.716-15-15 0-8.284-6.716-15-15-15z"/>
        <circle cx="64" cy="64" r="20" fill="#FFF" opacity="0.3"/>
      </svg>
    ),
  },
  {
    name: "Bolt",
    color: "#FFD300",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#FFD300" d="M64 10L30 60h28l-10 48 44-58H64z"/>
        <path fill="#FFA000" d="M64 10L30 60h28l-10 48z" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: "Copilot",
    color: "#8B68C6",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="copilot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B68C6"/>
            <stop offset="100%" stopColor="#5E42A6"/>
          </linearGradient>
        </defs>
        <path fill="url(#copilot-gradient)" d="M64 10C40 10 20 30 20 54c0 15 8 28 20 35v19l14-8c3 1 6 1 10 1 24 0 44-20 44-44S88 10 64 10z"/>
        <circle cx="50" cy="54" r="6" fill="#FFF"/>
        <circle cx="78" cy="54" r="6" fill="#FFF"/>
        <path d="M50 70c3 5 8 8 14 8s11-3 14-8" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Claude",
    color: "#D4A574",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="claude-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A574"/>
            <stop offset="100%" stopColor="#B8926A"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="20" fill="url(#claude-gradient)"/>
        <path d="M30 45h68M40 64h48M35 83h58" stroke="#FFF" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "MongoDB",
    color: "#47A248",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#47A248" d="M65.7 112.8c-.7 2.6-1.5 3.6-2.2 4.4-.9-1-1.6-2-2.3-4.4-.6-1.9-.9-3.7-1-5.5v-.1l3.5-63.5 3.5 63.5v.1c-.1 1.8-.4 3.6-1.5 5.5z"/>
        <path fill="#47A248" d="M63.5 0C48.1 0 35 12.9 35 28.8c0 13.9 9.3 25.7 22.1 29.5l.9.2v51.7c0 1.6 1.3 2.8 2.9 2.8s2.9-1.3 2.9-2.8V58.5l.9-.2C77.5 54.4 86.8 42.7 86.8 28.8 86.8 12.9 78.9 0 63.5 0z"/>
      </svg>
    ),
  },
  {
    name: "Express",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="currentColor" d="M126.67 98.44c-4.56 1.16-7.38.05-9.91-3.75-5.68-8.51-11.95-16.63-18-24.9-.78-1.07-1.59-2.12-2.6-3.45C89 76 81.85 85.2 75.14 94.77c-2.4 3.42-4.92 4.91-9.4 3.7l26.92-36.13L67.6 29.71c4.31-.84 7.29-.41 9.93 3.45 5.83 8.52 12.26 16.63 18.67 25.21 6.45-8.55 12.8-16.67 18.8-25.11 2.41-3.42 5-4.72 9.33-3.46-3.28 4.35-6.49 8.63-9.72 12.88-4.36 5.73-8.64 11.53-13.16 17.14-1.61 2-1.35 3.3.09 5.19C109.9 76 118.16 87.1 126.67 98.44zM1.33 61.74c.72-3.61 1.2-7.29 2.2-10.83 6-21.43 30.6-30.34 47.5-17.06C60.93 41.64 63.39 52.62 62.9 65H7.1c-.84 22.21 15.15 35.62 35.53 28.78 7.15-2.4 11.36-8 13.47-15 1.07-3.51 2.84-4.06 6.14-3.06-1.69 8.76-5.52 16.08-13.52 20.66-12 6.86-29.13 4.64-38.14-4.89C5.26 85.89 3 78.92 2 71.39c-.15-1.2-.46-2.38-.7-3.57q.03-3.04.03-6.08zm5.87-1.49h50.43c-.33-16.06-10.33-27.47-24-27.57-15-.12-25.78 11.02-26.43 27.57z"/>
      </svg>
    ),
  },
  {
    name: "TailwindCSS",
    color: "#06B6D4",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#06B6D4" d="M64 0C38.4 0 25.6 12.8 25.6 38.4c6.4-12.8 19.2-17.92 32-12.8 6.912 3.456 11.904 8.448 17.408 13.952C82.944 47.488 92.8 57.6 102.4 57.6c25.6 0 38.4-12.8 38.4-38.4-6.4 12.8-19.2 17.92-32 12.8-6.912-3.456-11.904-8.448-17.408-13.952C83.456 9.6 73.6-.512 64 0zM25.6 64C0 64-12.8 76.8-12.8 102.4c6.4-12.8 19.2-17.92 32-12.8 6.912 3.456 11.904 8.448 17.408 13.952C44.544 111.488 54.4 121.6 64 121.6c25.6 0 38.4-12.8 38.4-38.4-6.4 12.8-19.2 17.92-32 12.8-6.912-3.456-11.904-8.448-17.408-13.952C45.056 73.6 35.2 63.488 25.6 64z"/>
      </svg>
    ),
  },
  {
    name: "VS Code",
    color: "#007ACC",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#007ACC" d="M95.9 27.7l-59.1 55.2L9.4 60.6 4 65.3l32.4 23.4L4 111.9l5.4 4.7 27.4-22.3 59.1 55.2 11.2-5.2V32.9l-11.2-5.2zM89 98.3L51.4 68.6 89 38.9v59.4z"/>
      </svg>
    ),
  },
  {
    name: "ChatGPT",
    color: "#10A37F",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#10A37F" d="M64 10C35 10 11 34 11 63s24 53 53 53 53-24 53-53-24-53-53-53zm0 90c-20 0-37-17-37-37s17-37 37-37 37 17 37 37-17 37-37 37z"/>
        <circle cx="64" cy="63" r="25" fill="#10A37F"/>
        <path stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M52 58l8 8 16-16"/>
      </svg>
    ),
  },
  {
    name: "NumPy",
    color: "#013243",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="numpy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4DABCF"/>
            <stop offset="100%" stopColor="#013243"/>
          </linearGradient>
        </defs>
        <path fill="url(#numpy-gradient)" d="M58 20L20 40v48l38 20 38-20V40L58 20zm0 10l28 15v30L58 90 30 75V45l28-15z"/>
        <path fill="#4DABCF" d="M58 35L40 45v20l18 10 18-10V45L58 35z"/>
      </svg>
    ),
  },
  {
    name: "Pandas",
    color: "#150458",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#150458" d="M50 30h10v25H50z"/>
        <path fill="#E70488" d="M68 30h10v25H68z"/>
        <path fill="#150458" d="M50 63h10v25H50z"/>
        <path fill="#E70488" d="M68 63h10v25H68z"/>
        <path fill="#150458" d="M50 96h10v2H50z"/>
        <path fill="#E70488" d="M68 96h10v2H68z"/>
      </svg>
    ),
  },
  {
    name: "Matplotlib",
    color: "#11557C",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="matplotlib-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#11557C"/>
            <stop offset="50%" stopColor="#3776AB"/>
            <stop offset="100%" stopColor="#FFD43B"/>
          </linearGradient>
        </defs>
        <rect x="20" y="70" width="15" height="38" fill="url(#matplotlib-gradient)"/>
        <rect x="40" y="50" width="15" height="58" fill="url(#matplotlib-gradient)"/>
        <rect x="60" y="35" width="15" height="73" fill="url(#matplotlib-gradient)"/>
        <rect x="80" y="55" width="15" height="53" fill="url(#matplotlib-gradient)"/>
        <path d="M15 110h100M15 110l5-5M15 110l5 5" stroke="#11557C" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    name: "Seaborn",
    color: "#3A8FB7",
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="seaborn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A8FB7"/>
            <stop offset="100%" stopColor="#2C6B8F"/>
          </linearGradient>
        </defs>
        <circle cx="35" cy="64" r="8" fill="url(#seaborn-gradient)"/>
        <circle cx="55" cy="50" r="10" fill="url(#seaborn-gradient)"/>
        <circle cx="75" cy="70" r="12" fill="url(#seaborn-gradient)"/>
        <circle cx="95" cy="45" r="9" fill="url(#seaborn-gradient)"/>
        <path d="M35 64 Q45 57 55 50 T75 70 Q85 57 95 45" stroke="#3A8FB7" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M20 90h88" stroke="#3A8FB7" strokeWidth="2"/>
      </svg>
    ),
  },
];
// --- END SVG DEFINITIONS ---

interface AnimatedTechLogosProps {
  variant?: "marquee" | "floating" | "grid" | "orbital";
  className?: string;
  skills?: string[]; // 1. Added skills prop (array of strings)
}

const AnimatedTechLogos = ({ variant = "floating", className = "", skills = [] }: AnimatedTechLogosProps) => {
  
  // Strict filter logic: ONLY show logos that closely match skills in the database
  // More strict matching - must be exact or very similar
  const filteredLogos = skills.length > 0 
    ? techLogos.filter(logo => 
        skills.some(skillName => {
          const logoLower = logo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const skillLower = skillName.toLowerCase().replace(/[^a-z0-9]/g, '');
          // Exact match or logo name starts with skill name (or vice versa)
          return logoLower === skillLower || 
                 logoLower.startsWith(skillLower) || 
                 skillLower.startsWith(logoLower);
        })
      )
    : [];

  // Use filtered logos directly - no fallback to all logos
  const activeLogos = filteredLogos;

  // If no skills or no matching logos, show empty state
  if (activeLogos.length === 0) {
    return (
      <div className={`relative h-80 md:h-96 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl md:text-3xl font-bold text-gradient">{"</>"}</span>
          </div>
          <p className="text-sm text-muted-foreground">Add skills in admin panel to see them here</p>
        </div>
      </div>
    );
  }

  // Orbital/circular animation variant
  if (variant === "orbital") {
    // Dynamic slicing for orbits based on how many skills matched
    const midpoint = Math.ceil(activeLogos.length / 2);
    const innerLogos = activeLogos.slice(0, midpoint);
    const outerLogos = activeLogos.slice(midpoint);

    return (
      <div className={`relative w-full h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] flex items-center justify-center overflow-visible ${className}`}>
        {/* Glowing background effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Center sun element */}
        <div className="absolute z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary via-cyan to-purple-500 border-2 border-primary/50 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)] sm:shadow-[0_0_50px_rgba(34,211,238,0.55)] md:shadow-[0_0_60px_rgba(34,211,238,0.6)] animate-pulse">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-transparent animate-spin-slow" />
          <span className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{"</>"}</span>
        </div>

        {/* Orbit rings with glow - aspect ratio preserved */}
        <div className="absolute aspect-square w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border-2 border-primary/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] sm:shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
        <div className="absolute aspect-square w-72 h-72 sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border-2 border-cyan/15 shadow-[0_0_25px_rgba(34,211,238,0.12)] sm:shadow-[0_0_30px_rgba(34,211,238,0.15)]" />

        {/* Inner orbit - perfectly circular */}
        <div className="absolute aspect-square w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full animate-spin-slow">
          {innerLogos.map((logo, index) => {
            const angle = (index * 360) / innerLogos.length;
            const radius = 50; // Keep at 50% for circular positioning
            return (
              <motion.div
                key={logo.name}
                className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14"
                style={{
                  left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.4, zIndex: 50 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  scale: { duration: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div
                  className="w-full h-full rounded-xl bg-gradient-to-br from-card to-card/80 border-2 border-primary/30 p-1.5 sm:p-2 md:p-2.5 flex items-center justify-center animate-counter-spin-slow shadow-2xl hover:border-primary/60 transition-all duration-300"
                  style={{ 
                    boxShadow: `0 0 20px ${logo.color}35, 0 0 40px ${logo.color}15`,
                  }}
                >
                  {logo.icon}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Outer orbit - perfectly circular */}
        {outerLogos.length > 0 && (
          <div className="absolute aspect-square w-72 h-72 sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full animate-spin-slower">
            {outerLogos.map((logo, index) => {
              const angle = (index * 360) / outerLogos.length + 30; // Offset start angle
              const radius = 50; // Keep at 50% for circular positioning
              return (
                <motion.div
                  key={logo.name}
                  className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14"
                  style={{
                    left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                    top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  whileHover={{ scale: 1.4, zIndex: 50 }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    scale: { duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div
                    className="w-full h-full rounded-xl bg-gradient-to-br from-card to-card/80 border-2 border-cyan/30 p-1.5 sm:p-2 md:p-2.5 flex items-center justify-center animate-counter-spin-slower shadow-2xl hover:border-cyan/60 transition-all duration-300"
                    style={{ 
                      boxShadow: `0 0 20px ${logo.color}35, 0 0 40px ${logo.color}15`,
                    }}
                  >
                    {logo.icon}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === "marquee") {
    return (
      <div className={`overflow-hidden py-8 ${className}`}>
        <div className="flex gap-8 marquee">
          {/* Duplicate activeLogos to create seamless loop */}
          {[...activeLogos, ...activeLogos].map((logo, index) => (
            <motion.div
              key={`${logo.name}-${index}`}
              className="tech-logo flex-shrink-0"
              whileHover={{ scale: 1.15, y: -5 }}
              style={{ 
                boxShadow: `0 0 20px ${logo.color}20`,
              }}
            >
              <div className="relative group">
                {logo.icon}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 ${className}`}>
        {activeLogos.map((logo, index) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ 
              scale: 1.2, 
              y: -8,
              boxShadow: `0 15px 40px ${logo.color}30`,
            }}
            className="tech-logo group cursor-pointer"
          >
            {logo.icon}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {logo.name}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  // Floating variant (default)
  return (
    <div className={`relative h-32 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-4 md:gap-6">
          {activeLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              animate={{
                y: [0, -12, 0],
              }}
              whileHover={{ 
                scale: 1.2, 
                boxShadow: `0 15px 40px ${logo.color}40`,
              }}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
              className="tech-logo group float-slow cursor-pointer"
            >
              {logo.icon}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTechLogos;