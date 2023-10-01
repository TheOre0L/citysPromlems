Create table person(
	id serial primary key,
	login varchar,
	password varchar,
	name varchar,
	surname varchar,
	avatar_img varchar,
	date_for_regist date
);
Create table post(
	id serial primary key,
	title varchar,
	short_desc varchar,
	context varchar,
	img_for_post varchar[],
	author_id int,
	likes int,
	coments int,
	repost int,
	date_for_create date
);
