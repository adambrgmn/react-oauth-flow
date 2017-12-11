/* eslint-disable import/first */
import './raf-polyfill';
import 'whatwg-fetch';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
