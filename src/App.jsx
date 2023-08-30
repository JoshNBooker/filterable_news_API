import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styled from 'styled-components';

dayjs.extend(relativeTime);

function App() {
	const [stories, setStories] = useState([]);
	const [filteredStories, setFilteredStories] = useState([]);

	const fetchStories = async () => {
		const storiesIDs = await fetch(
			'https://hacker-news.firebaseio.com/v0/topstories.json'
		)
			.then((res) => res.json())
			.then((data) => {
				console.log('during fetch');
				return data.slice(0, 20);
			});

		const storiesPromises = storiesIDs.map((id) =>
			fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
				(res) => res.json()
			)
		);
		console.log(storiesPromises);
		Promise.all(storiesPromises).then((data) => {
			setFilteredStories(data);
			setStories(data);
		});
	};

	useEffect(() => {
		fetchStories();
	}, []);
	console.log(stories);
	console.log(filteredStories);

	const handleSearch = (event) => {
		const filteredValues = stories.filter((story) => {
			return story.title
				.toLowerCase()
				.includes(event.target.value.toLowerCase());
		});
		setFilteredStories(filteredValues);
	};

	const Header = styled.div`
		background-color: #ff6600;
	`;

	const Container = styled.div`
		min-width: 796px;
		width: 85%;
	`;

	const List = styled.div`
		background-color: rgb(246, 246, 239);
	`;

	return (
		<>
			Hacker News login Search:{' '}
			<input type="text" onChange={handleSearch} />
			<ol>
				{filteredStories.map((story) => (
					<li key={story.id}>
						<a href={`${story.url}`}> {story.title}</a>
						<h6>
							{story.score} points by {story.by}
							<Time date={story.time} />
							{story.descendants} comments
						</h6>
					</li>
				))}
			</ol>
		</>
	);
}

const Time = ({ date }) => {
	const relativeTime = dayjs.unix(date).fromNow();
	return <p>{relativeTime}</p>;
};

export default App;
