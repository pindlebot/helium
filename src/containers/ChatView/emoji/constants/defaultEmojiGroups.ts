import React from 'react';

import * as icons from 'react-icons/fa'

const {
  FaSmile,
  FaPaw,
  FaCutlery,
  FaFutbol,
  FaPlane,
  FaBell,
  FaHeart,
  FaFlag
} = icons
const defaultEmojiGroups = [{
  title: 'People',
  icon: (
    <FaSmile style={{ verticalAlign: '' }} />
  ),
  categories: ['people'],
}, {
  title: 'Nature',
  icon: (
    <FaPaw style={{ verticalAlign: '' }} />
  ),
  categories: ['nature'],
}, {
  title: 'Activity',
  icon: (
    <FaFutbol style={{ verticalAlign: '' }} />
  ),
  categories: ['activity'],
}, {
  title: 'Travel & Places',
  icon: (
    <FaPlane style={{ verticalAlign: '' }} />
  ),
  categories: ['travel'],
}, {
  title: 'Objects',
  icon: (
    <FaBell style={{ verticalAlign: '' }} />
  ),
  categories: ['objects'],
}, {
  title: 'Symbols',
  icon: (
    <FaHeart style={{ verticalAlign: '' }} />
  ),
  categories: ['symbols'],
}, {
  title: 'Flags',
  icon: (
    <FaFlag style={{ verticalAlign: '' }} />
  ),
  categories: ['flags'],
}];

export default defaultEmojiGroups
