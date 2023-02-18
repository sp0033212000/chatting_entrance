import React from "react";

import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Flexbox from "@/src/components/common/Flexbox";

const Header = () => {
  return (
    <React.Fragment>
      <header className={"fixed top-0 left-0 px-4 py-3 w-full font-[Orbitron]"}>
        <Flexbox
          as={"h1"}
          align={"center"}
          className={"relative text-4xl text-white font-bold"}
        >
          <FontAwesomeIcon icon={faComments} className={"mr-2 w-10 h-10"} />
          Chatting
        </Flexbox>
      </header>
      <div className={"w-full h-16"} />
    </React.Fragment>
  );
};

export default Header;
