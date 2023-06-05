-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2023 at 06:05 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitforum`
--

-- --------------------------------------------------------

CREATE TABLE `category` (
  `sno` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `icon` text NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `category` (`sno`, `title`, `description`, `icon`, `image`) VALUES
(1, 'General', 'Discuss various topics, seek advice, and find support in our grievance forum', 'fa-solid fa-globe', 'generalCategoryPoster.png'),
(2, 'Hostel', 'Address hostel accommodation issues, seek advice, and find support in our forum.', 'fa-solid fa-hotel', 'hostelCategoryPoster.png'),
(3, 'Food', 'Share concerns about food services, seek advice, and find support in our forum.', 'fa-solid fa-bowl-food', 'foodCategoryPoster.png'),
(4, 'Sports', 'Discuss sports facility issues, seek advice, and find support in our forum.', 'fa-solid fa-baseball-bat-ball', 'sportsCategory.png'),
(5, 'Exam', 'Address exam-related concerns, seek advice, and find support in our forum.', 'fa-solid fa-file-pen', 'examCategory.png'),
(6, 'Special Lab', 'Discuss special lab facility issues, seek advice, and find support in our forum.', 'fa-solid fa-computer', 'labCategory.png'),
(7, 'Transport', 'Share transportation concerns, seek advice, and find support in our forum.', 'fa-solid fa-bus', 'transportCategory.png');

-- --------------------------------------------------------

CREATE TABLE `comments` (
  `sno` int(11) NOT NULL,
  `mail` text NOT NULL,
  `name` text NOT NULL,
  `picture` text NOT NULL,
  `postid` int(11) NOT NULL,
  `message` text NOT NULL,
  `datetime` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

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

-- --------------------------------------------------------

CREATE TABLE `postinfo` (
  `sno` int(11) NOT NULL,
  `postid` text NOT NULL,
  `mail` text NOT NULL,
  `name` text NOT NULL,
  `picture` text NOT NULL,
  `message` text NOT NULL,
  `type` int(11) NOT NULL,
  `datetime` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

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
  `status` int(11) NOT NULL,
  `short_id` text NOT NULL,
  `priority_level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` text NOT NULL,
  `mail` text NOT NULL,
  `isadmin` int(11) NOT NULL,
  `admintype` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `category` ADD PRIMARY KEY (`sno`);
ALTER TABLE `comments` ADD PRIMARY KEY (`sno`);
ALTER TABLE `notifications` ADD PRIMARY KEY (`sno`);
ALTER TABLE `postinfo` ADD PRIMARY KEY (`sno`);
ALTER TABLE `posts` ADD PRIMARY KEY (`sno`);
ALTER TABLE `users` ADD PRIMARY KEY (`userid`);
ALTER TABLE `category` MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `comments` MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
ALTER TABLE `notifications` MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;
ALTER TABLE `postinfo` MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;
ALTER TABLE `posts` MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;
ALTER TABLE `users` MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
