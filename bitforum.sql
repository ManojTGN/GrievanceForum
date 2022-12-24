-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2022 at 11:03 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `bitforum`
--

CREATE TABLE `category` (
  `sno` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `icon` text NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `comments` (
  `sno` int(11) NOT NULL,
  `mail` text NOT NULL,
  `name` text NOT NULL,
  `picture` text NOT NULL,
  `postid` int(11) NOT NULL,
  `message` text NOT NULL,
  `datetime` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notifications` (
  `sno` int(11) NOT NULL,
  `mail` text NOT NULL,
  `title` text NOT NULL,
  `message` text NOT NULL,
  `button` text NOT NULL,
  `icon` text NOT NULL,
  `color` text NOT NULL,
  `datetime` text NOT NULL,
  `isread` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `postinfo` (
  `sno` int(11) NOT NULL,
  `postid` text NOT NULL,
  `mail` text NOT NULL,
  `name` text NOT NULL,
  `picture` text NOT NULL,
  `message` text NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `posts` (
  `sno` int(11) NOT NULL,
  `id` text NOT NULL,
  `mail` text NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `report` text NOT NULL,
  `category` int(11) NOT NULL,
  `cat_name` text NOT NULL,
  `visibility` int(11) NOT NULL,
  `anonymous` int(11) NOT NULL,
  `comment` int(11) NOT NULL,
  `support` int(11) NOT NULL,
  `draft` int(11) NOT NULL,
  `datetime` text NOT NULL,
  `views` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  `comments` int(11) NOT NULL,
  `name` text NOT NULL,
  `picture` text NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` text NOT NULL,
  `mail` text NOT NULL,
  `isadmin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `category` (`sno`, `title`, `description`, `icon`, `image`) VALUES
(1, 'General', 'General Category blah blah', 'fa-solid fa-globe', 'generalCategoryPoster.png'),
(2, 'Hostel', 'Hostel Category blah blah', 'fa-solid fa-hotel', 'hostelCategoryPoster.png'),
(3, 'Food', 'Food Category blah blah blah', 'fa-solid fa-bowl-food', 'foodCategoryPoster.png'),
(4, 'Sports', 'Sports Category blah blah blah', 'fa-solid fa-baseball-bat-ball', 'sportsCategory.png'),
(5, 'Exam', 'Exam Category blah blah blah', 'fa-solid fa-file-pen', 'examCategory.png'),
(6, 'Special Lab', 'Special Lab Category blah blah blah', 'fa-solid fa-computer', 'labCategory.png'),
(7, 'Transport', 'Transport Category blah blah blah', 'fa-solid fa-bus', 'transportCategory.png');

ALTER TABLE `category`
  ADD PRIMARY KEY (`sno`);

ALTER TABLE `comments`
  ADD PRIMARY KEY (`sno`);

ALTER TABLE `notifications`
  ADD PRIMARY KEY (`sno`);

ALTER TABLE `postinfo`
  ADD PRIMARY KEY (`sno`);

ALTER TABLE `posts`
  ADD PRIMARY KEY (`sno`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

ALTER TABLE `category`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `comments`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `notifications`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

ALTER TABLE `postinfo`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

ALTER TABLE `posts`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

COMMIT;
