import test from 'ava';

import Render from '../src/index';

test.beforeEach(() => {
	Render.reset();
	Render.init({ autostart: false });
});

test('add test', t => {
	Render.add(function() {}, 30);
	t.is(Render._datas.length, 1);
	t.is(Render._datas[ 0 ].fps, 30);
});

test('add multiple test', t => {
	Render.add(function() {}, 30);
	Render.add(function() {}, 30);
	t.is(Render._datas.length, 2);
	t.is(Render._datas[ 0 ].fps, 30);
	t.is(Render._datas[ 1 ].fps, 30);
});

test('remove test', t => {
	const noop = function() {};
	Render.add(noop, 30);
	t.is(Render._datas.length, 1);
	Render.remove(noop);
	t.is(Render._datas.length, 0);
});
