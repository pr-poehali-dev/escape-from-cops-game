import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Position {
  x: number;
  y: number;
}

interface Laser {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'horizontal' | 'vertical';
  active: boolean;
}

interface Enemy {
  x: number;
  y: number;
  direction: number;
  speed: number;
  patrolDistance: number;
  startX: number;
}

export default function PrisonEscapeGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver' | 'victory'>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 450 });
  const [keys, setKeys] = useState<{[key: string]: boolean}>({});
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  
  // Препятствия для разных уровней
  const levels = {
    1: {
      name: "Побег из камеры",
      lasers: [
        { x: 200, y: 200, width: 300, height: 5, direction: 'horizontal' as const, active: true },
        { x: 400, y: 350, width: 5, height: 200, direction: 'vertical' as const, active: true }
      ],
      enemies: [
        { x: 600, y: 400, direction: 1, speed: 1, patrolDistance: 150, startX: 600 }
      ],
      exitPos: { x: 750, y: 50 }
    },
    2: {
      name: "Лазерные коридоры", 
      lasers: [
        { x: 150, y: 150, width: 400, height: 5, direction: 'horizontal' as const, active: true },
        { x: 300, y: 250, width: 5, height: 150, direction: 'vertical' as const, active: true },
        { x: 500, y: 350, width: 200, height: 5, direction: 'horizontal' as const, active: true }
      ],
      enemies: [
        { x: 300, y: 300, direction: 1, speed: 1.5, patrolDistance: 200, startX: 300 },
        { x: 550, y: 200, direction: -1, speed: 1, patrolDistance: 100, startX: 550 }
      ],
      exitPos: { x: 750, y: 100 }
    },
    3: {
      name: "Битва с боссом",
      lasers: [
        { x: 200, y: 200, width: 5, height: 300, direction: 'vertical' as const, active: true },
        { x: 400, y: 300, width: 300, height: 5, direction: 'horizontal' as const, active: true },
        { x: 600, y: 150, width: 5, height: 250, direction: 'vertical' as const, active: true }
      ],
      enemies: [
        { x: 400, y: 250, direction: 1, speed: 2, patrolDistance: 300, startX: 400 } // Босс
      ],
      exitPos: { x: 750, y: 50 }
    }
  };

  const [enemies, setEnemies] = useState<Enemy[]>(levels[currentLevel as keyof typeof levels].enemies);

  // Управление клавишами
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Движение игрока
  useEffect(() => {
    if (gameState !== 'playing') return;

    const movePlayer = () => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 3;

        if (keys['a'] || keys['arrowleft']) newX = Math.max(0, newX - speed);
        if (keys['d'] || keys['arrowright']) newX = Math.min(750, newX + speed);
        if (keys['w'] || keys['arrowup']) newY = Math.max(0, newY - speed);
        if (keys['s'] || keys['arrowdown']) newY = Math.min(450, newY + speed);

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(movePlayer, 16);
    return () => clearInterval(interval);
  }, [keys, gameState]);

  // Движение врагов
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveEnemies = () => {
      setEnemies(prev => prev.map(enemy => {
        let newX = enemy.x + (enemy.direction * enemy.speed);
        let newDirection = enemy.direction;

        if (newX <= enemy.startX - enemy.patrolDistance || newX >= enemy.startX + enemy.patrolDistance) {
          newDirection = -enemy.direction;
          newX = enemy.x + (newDirection * enemy.speed);
        }

        return { ...enemy, x: newX, direction: newDirection };
      }));
    };

    const interval = setInterval(moveEnemies, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  // Проверка коллизий
  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkCollisions = () => {
      const level = levels[currentLevel as keyof typeof levels];
      
      // Проверка лазеров
      level.lasers.forEach(laser => {
        if (laser.active) {
          const collision = laser.direction === 'horizontal' 
            ? playerPos.x + 20 > laser.x && playerPos.x < laser.x + laser.width && 
              playerPos.y + 20 > laser.y && playerPos.y < laser.y + laser.height
            : playerPos.x + 20 > laser.x && playerPos.x < laser.x + laser.width && 
              playerPos.y + 20 > laser.y && playerPos.y < laser.y + laser.height;

          if (collision) {
            setHealth(prev => Math.max(0, prev - 2));
          }
        }
      });

      // Проверка врагов
      enemies.forEach(enemy => {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - enemy.x, 2) + Math.pow(playerPos.y - enemy.y, 2)
        );
        
        if (distance < 30) {
          setHealth(prev => Math.max(0, prev - 3));
        }
      });

      // Проверка выхода
      const exitDistance = Math.sqrt(
        Math.pow(playerPos.x - level.exitPos.x, 2) + Math.pow(playerPos.y - level.exitPos.y, 2)
      );
      
      if (exitDistance < 40) {
        if (currentLevel === 3) {
          setGameState('victory');
          setScore(prev => prev + 1000);
        } else {
          setCurrentLevel(prev => prev + 1);
          setPlayerPos({ x: 50, y: 450 });
          setEnemies(levels[(currentLevel + 1) as keyof typeof levels].enemies);
          setScore(prev => prev + 500);
          setHealth(prev => Math.min(100, prev + 25));
        }
      }
    };

    const interval = setInterval(checkCollisions, 50);
    return () => clearInterval(interval);
  }, [playerPos, enemies, currentLevel, gameState]);

  // Проверка смерти
  useEffect(() => {
    if (health <= 0) {
      setGameState('gameOver');
    }
  }, [health]);

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setPlayerPos({ x: 50, y: 450 });
    setHealth(100);
    setScore(0);
    setEnemies(levels[1].enemies);
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentLevel(1);
    setPlayerPos({ x: 50, y: 450 });
    setHealth(100);
    setScore(0);
    setEnemies(levels[1].enemies);
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-prison-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-title text-6xl font-bold mb-8 text-danger-red">PRISON ESCAPE</h1>
          <p className="text-xl mb-8 text-gray-300">Убегайте от полицейских, избегайте лазеров, победите босса!</p>
          <div className="space-y-4 mb-8">
            <p className="text-gray-400">Управление: WASD или стрелки</p>
            <p className="text-gray-400">Избегайте красных лазеров и врагов</p>
            <p className="text-gray-400">Доберитесь до зеленого выхода</p>
          </div>
          <Button onClick={startGame} className="bg-danger-red hover:bg-danger-red/80 text-white font-semibold text-xl px-8 py-4">
            <Icon name="Play" className="mr-2" size={24} />
            Начать побег
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-prison-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-title text-6xl font-bold mb-8 text-danger-red">ПОЙМАЛИ!</h1>
          <p className="text-xl mb-4">Очки: {score}</p>
          <p className="text-xl mb-8">Уровень: {currentLevel}</p>
          <div className="space-x-4">
            <Button onClick={startGame} className="bg-danger-red hover:bg-danger-red/80 text-white font-semibold">
              Попробовать снова
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-gray-500 text-gray-300">
              В меню
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="min-h-screen bg-prison-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-title text-6xl font-bold mb-8 text-laser-green">СВОБОДА!</h1>
          <p className="text-xl mb-4">Вы победили босса и сбежали!</p>
          <p className="text-xl mb-4">Итоговые очки: {score}</p>
          <p className="text-gray-300 mb-8">Теперь можете ехать домой в пустыню!</p>
          <Button onClick={resetGame} className="bg-laser-green hover:bg-laser-green/80 text-prison-black font-semibold">
            Играть заново
          </Button>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel as keyof typeof levels];

  return (
    <div className="min-h-screen bg-prison-black text-white overflow-hidden">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-black/80 px-4 py-2 rounded">
          <p className="font-title text-lg">Уровень: {currentLevel} - {level.name}</p>
        </div>
        <div className="bg-black/80 px-4 py-2 rounded">
          <p>Здоровье: <span className="text-danger-red">{health}%</span></p>
        </div>
        <div className="bg-black/80 px-4 py-2 rounded">
          <p>Очки: <span className="text-laser-green">{score}</span></p>
        </div>
      </div>

      {/* Игровое поле */}
      <div className="relative w-full h-screen bg-gradient-to-b from-cell-dark to-prison-black">
        
        {/* Лазеры */}
        {level.lasers.map((laser, index) => (
          <div
            key={index}
            className={`absolute bg-danger-red ${laser.active ? 'opacity-80' : 'opacity-20'}`}
            style={{
              left: laser.x,
              top: laser.y,
              width: laser.width,
              height: laser.height,
              boxShadow: laser.active ? '0 0 20px #FF4444' : 'none'
            }}
          />
        ))}

        {/* Враги */}
        {enemies.map((enemy, index) => (
          <div
            key={index}
            className="absolute w-8 h-8 bg-yellow-500 rounded-full border-2 border-yellow-300"
            style={{
              left: enemy.x,
              top: enemy.y,
              boxShadow: '0 0 10px #FFC107'
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs">👮</div>
          </div>
        ))}

        {/* Игрок */}
        <div
          className="absolute w-6 h-6 bg-blue-500 rounded border-2 border-blue-300 transition-all duration-75"
          style={{
            left: playerPos.x,
            top: playerPos.y,
            boxShadow: '0 0 10px #3B82F6'
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xs">🏃</div>
        </div>

        {/* Выход */}
        <div
          className="absolute w-12 h-12 bg-laser-green rounded-full border-4 border-green-300"
          style={{
            left: level.exitPos.x,
            top: level.exitPos.y,
            boxShadow: '0 0 30px #00FF88'
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xl">🚪</div>
        </div>

        {/* Препятствия (стены) */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-prison-gray"></div>
        <div className="absolute top-0 left-0 w-full h-4 bg-prison-gray"></div>
        <div className="absolute top-0 left-0 w-4 h-full bg-prison-gray"></div>
        <div className="absolute top-0 right-0 w-4 h-full bg-prison-gray"></div>
      </div>

      {/* Инструкции */}
      <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded text-sm">
        <p>WASD / Стрелки - движение</p>
        <p>Избегайте <span className="text-danger-red">красных лазеров</span> и <span className="text-yellow-500">полицейских</span></p>
        <p>Доберитесь до <span className="text-laser-green">зеленого выхода</span></p>
      </div>
    </div>
  );
}