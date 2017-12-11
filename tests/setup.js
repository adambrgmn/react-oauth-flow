/* eslint-disable import/first */
import './raf-polyfill';
import 'isomorphic-fetch';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
