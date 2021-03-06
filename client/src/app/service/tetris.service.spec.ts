import { TestBed } from '@angular/core/testing';

import { TetrisService } from './tetris.service';
import { TetroMino } from '../model/tetromino.model';
import { Game } from '../model/game.model';

describe('TetrisService', () => {
  let service: TetrisService;
  const testgrid = new Game();
  const tetro = new TetroMino();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TetrisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return color for ghost', () => {
    const color = service.returnColor(service.ghost + 8);
    expect(color).toEqual('ghost type8');
  });

  it('should be return color watermark', () => {
    const color = service.returnColor(service.watermark + 8);
    expect(color).toEqual('type8');
  });

  it('should be return color delete animation', () => {
    const color = service.returnColor(service.destroy + 8);
    expect(color).toEqual('animate__animated animate__bounceOut type8');
  });

  it('should be return tetromino', () => {
    console.log('tetro', tetro);
    expect(tetro).toBeInstanceOf(TetroMino);
  });

  it('should be return game', () => {
    expect(testgrid).toBeInstanceOf(Game);
  });

  it('should be return lastY', () => {
    tetro.position.ymax = service.lastYValidPlace(tetro, testgrid);
    expect(tetro.position.ymax).toEqual(testgrid.shape.length - 2);
  });

  it('should  draw Tetromino into grid', () => {
    service.draw(testgrid, tetro);
    expect(testgrid.shape.every(row => row.every(cube => cube === 0) === true)).toBeFalse();
  });

  it('should be return False for valid place on 10', () => {
    const validplace = service.isValidPlace(tetro.shape, tetro.sign, testgrid, 10, tetro.position.ymax);
    expect(validplace).toBeFalse();
  });



});
