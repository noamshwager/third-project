-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 19, 2021 at 10:56 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `VacationTaggingDB`
--
CREATE DATABASE IF NOT EXISTS `VacationTaggingDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `VacationTaggingDB`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userId`, `vacationId`) VALUES
(21, 1),
(21, 16),
(21, 129),
(32, 30),
(32, 129);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `isAdmin` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `userName`, `password`, `isAdmin`) VALUES
(19, 'dddd', 'dddd', 'dddd', 'dd58f71b3ce0bffdc3c53435ac4b065f82cb0f77ef13051c2f3bc639c5e5ffeac4a9b8af95026fa637a0a7210817e1aef9f3d9e07a821d70028d41203d4c7498', 'yes'),
(21, 'xxxx', 'xxxx', 'xxxx', 'dd58f71b3ce0bffdc3c53435ac4b065f82cb0f77ef13051c2f3bc639c5e5ffeac4a9b8af95026fa637a0a7210817e1aef9f3d9e07a821d70028d41203d4c7498', 'no'),
(32, 'cccc', 'cccc', 'cccc', 'dd58f71b3ce0bffdc3c53435ac4b065f82cb0f77ef13051c2f3bc639c5e5ffeac4a9b8af95026fa637a0a7210817e1aef9f3d9e07a821d70028d41203d4c7498', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `location` varchar(150) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `vacationImage` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `location`, `startDate`, `endDate`, `price`, `description`, `vacationImage`) VALUES
(1, 'Rome', '2021-06-16', '2021-06-23', 1000, 'In rome you can visit ancient and impressive structures such as the Colosseum, and get to taste the best of Italian cuisine ', 'ea5585e8-b9a1-4b18-92d6-b4c66c3ec1a1.jpeg'),
(2, 'Paris', '2021-05-05', '2021-05-17', 1000, 'In Paris you can see the Eiffel tower \n,speak French and get to taste the best of\nFrench cuisine', 'e9ce189f-a4bd-4838-ac07-b642cbfb36de.jpg'),
(16, 'Norway', '2022-02-22', '2022-03-07', 2000, 'In Norway you can enjoy a variety of winter suiting activities such as skiing, mountain climbing and sled riding!', 'eda88519-0f7f-45e4-9d08-1a5edbe8182e.jpeg'),
(30, 'San Francisco', '2021-06-16', '2021-06-24', 1500, 'San Francisco is a remarkably beautiful city with piers where you can witness free roaming seals and enjoy the best of fried foods', '5018533a-8a6d-432f-8859-a9a1b881a679.jpeg'),
(129, 'Amsterdam', '2022-02-14', '2022-02-22', 1000, 'In Amsterdam you\'ll be able to ride a boat in beautiful canals and ride a bike in its large park called Vondelpark', '2ebb19d3-82ff-49db-8a35-dab27214dd73.jpeg'),
(134, 'Los Angeles', '2021-06-16', '2021-06-26', 1500, 'In Los Angeles you\'ll find the biggest variety of activities, from spending all day in amazing beaches to going to luxurious night clubs', '1454b994-b8c3-47da-844e-3cec0ab92ce0.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`userId`,`vacationId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userName` (`userName`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `followers_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
