import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItems from "./NavigationItems";
import NavigationItem from "./navigationItem/NavigationItem";

configure({ adapter: new Adapter() });

//Test rendered child components encounters

describe("<NavigationItems />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it("shouuld render two <NavigationItem /> elements if not authenticated", () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it("shouuld render three <NavigationItem /> elements if authenticated", () => {
    // wrapper = shallow(<NavigationItems isAthenticated />);
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it("<NavigationItems /> contains logout", () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
    ).toEqual(true);
  });
});
