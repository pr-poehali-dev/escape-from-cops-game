import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Buba {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  clickPower: number;
  color: string;
}

interface PlayerBuba extends Buba {
  count: number;
}

const BUBAS: Buba[] = [
  { id: '1', name: 'Обычный Буба', emoji: '🐱', rarity: 'common', clickPower: 1, color: 'bg-gray-500' },
  { id: '2', name: 'Радостный Буба', emoji: '😺', rarity: 'common', clickPower: 1, color: 'bg-gray-500' },
  { id: '3', name: 'Сонный Буба', emoji: '😴', rarity: 'common', clickPower: 2, color: 'bg-gray-400' },
  { id: '4', name: 'Злой Буба', emoji: '😾', rarity: 'rare', clickPower: 5, color: 'bg-blue-500' },
  { id: '5', name: 'Крутой Буба', emoji: '😎', rarity: 'rare', clickPower: 8, color: 'bg-blue-600' },
  { id: '6', name: 'Умный Буба', emoji: '🤓', rarity: 'rare', clickPower: 10, color: 'bg-blue-700' },
  { id: '7', name: 'Космо Буба', emoji: '🚀', rarity: 'epic', clickPower: 25, color: 'bg-purple-500' },
  { id: '8', name: 'Король Буба', emoji: '👑', rarity: 'epic', clickPower: 50, color: 'bg-purple-600' },
  { id: '9', name: 'Волшебный Буба', emoji: '🪄', rarity: 'epic', clickPower: 75, color: 'bg-purple-700' },
  { id: '10', name: 'Золотой Буба', emoji: '✨', rarity: 'legendary', clickPower: 200, color: 'bg-yellow-500' },
  { id: '11', name: 'Алмазный Буба', emoji: '💎', rarity: 'legendary', clickPower: 500, color: 'bg-cyan-500' },
  { id: '12', name: 'Радужный Буба', emoji: '🌈', rarity: 'legendary', clickPower: 1000, color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500' },
];

const CASE_COST = 100;

const RARITY_CHANCES = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3
};

export default function BubaClicker() {
  const [clicks, setClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [inventory, setInventory] = useState<PlayerBuba[]>([]);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{id: number, value: number, x: number, y: number}>>([]);
  const [caseOpening, setCaseOpening] = useState(false);
  const [openedBuba, setOpenedBuba] = useState<Buba | null>(null);
  const { toast } = useToast();

  const clickPowerPerClick = inventory.reduce((sum, buba) => sum + (buba.clickPower * buba.count), 0) || 1;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const power = clickPowerPerClick;
    setClicks(prev => prev + power);
    setTotalClicks(prev => prev + power);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 100);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newFloat = {
      id: Date.now(),
      value: power,
      x,
      y
    };
    
    setFloatingNumbers(prev => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1000);
  };

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const openCase = () => {
    if (clicks < CASE_COST) {
      toast({
        title: "Недостаточно кликов!",
        description: `Нужно ${CASE_COST} кликов для открытия кейса`,
        variant: "destructive"
      });
      return;
    }

    setClicks(prev => prev - CASE_COST);
    setCaseOpening(true);

    setTimeout(() => {
      const random = Math.random() * 100;
      let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
      
      if (random < RARITY_CHANCES.legendary) {
        rarity = 'legendary';
      } else if (random < RARITY_CHANCES.legendary + RARITY_CHANCES.epic) {
        rarity = 'epic';
      } else if (random < RARITY_CHANCES.legendary + RARITY_CHANCES.epic + RARITY_CHANCES.rare) {
        rarity = 'rare';
      }

      const bubasOfRarity = BUBAS.filter(b => b.rarity === rarity);
      const wonBuba = bubasOfRarity[Math.floor(Math.random() * bubasOfRarity.length)];

      setOpenedBuba(wonBuba);
      
      setInventory(prev => {
        const existing = prev.find(b => b.id === wonBuba.id);
        if (existing) {
          return prev.map(b => b.id === wonBuba.id ? {...b, count: b.count + 1} : b);
        }
        return [...prev, {...wonBuba, count: 1}];
      });

      toast({
        title: `Получен ${rarity === 'legendary' ? '🌟' : rarity === 'epic' ? '💜' : rarity === 'rare' ? '💙' : '⚪'} ${wonBuba.name}!`,
        description: `Сила клика: +${wonBuba.clickPower}`,
      });

      setTimeout(() => {
        setCaseOpening(false);
        setOpenedBuba(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 drop-shadow-lg">
          🐱 БУБА КЛИКЕР 🐱
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 p-6">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-yellow-400">{clicks.toLocaleString()} кликов</p>
              <p className="text-sm text-gray-300">Всего кликов: {totalClicks.toLocaleString()}</p>
              <p className="text-lg text-green-400 mt-2">+{clickPowerPerClick} за клик</p>
            </div>

            <div 
              onClick={handleClick}
              className={`relative cursor-pointer select-none transition-transform ${clickAnimation ? 'scale-95' : 'scale-100'} hover:scale-105`}
            >
              <div className="text-[200px] text-center leading-none">
                🐱
              </div>
              {floatingNumbers.map(float => (
                <div
                  key={float.id}
                  className="absolute text-3xl font-bold text-yellow-400 pointer-events-none animate-float"
                  style={{
                    left: float.x,
                    top: float.y,
                    animation: 'floatUp 1s ease-out forwards'
                  }}
                >
                  +{float.value}
                </div>
              ))}
            </div>

            <Button 
              onClick={openCase}
              disabled={clicks < CASE_COST || caseOpening}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6"
            >
              {caseOpening ? '🎁 Открываем...' : `🎁 Открыть Кейс (${CASE_COST} кликов)`}
            </Button>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Package" size={28} />
              Коллекция Буб
            </h2>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {inventory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Открой кейс, чтобы получить буб!</p>
              ) : (
                inventory.map(buba => (
                  <div key={buba.id} className={`${buba.color} bg-opacity-20 border border-current rounded-lg p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{buba.emoji}</span>
                      <div>
                        <p className={`font-bold ${getRarityColor(buba.rarity)}`}>{buba.name}</p>
                        <p className="text-sm text-gray-300">+{buba.clickPower} за клик</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">x{buba.count}</p>
                      <p className="text-xs text-gray-400">{buba.rarity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Library" size={28} />
            Все Бубы
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BUBAS.map(buba => {
              const owned = inventory.find(b => b.id === buba.id);
              return (
                <div 
                  key={buba.id} 
                  className={`${buba.color} ${owned ? 'bg-opacity-30' : 'bg-opacity-10 grayscale'} border border-current rounded-lg p-3 text-center transition-all hover:scale-105`}
                >
                  <div className="text-5xl mb-2">{buba.emoji}</div>
                  <p className={`text-xs font-bold ${getRarityColor(buba.rarity)}`}>{buba.name}</p>
                  <p className="text-xs text-gray-400">+{buba.clickPower}</p>
                  {owned && <p className="text-xs text-green-400 mt-1">x{owned.count}</p>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {caseOpening && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-pulse">
            <div className="text-9xl mb-4">🎁</div>
            {openedBuba ? (
              <div className="animate-bounce">
                <div className="text-9xl mb-4">{openedBuba.emoji}</div>
                <p className={`text-4xl font-bold ${getRarityColor(openedBuba.rarity)}`}>
                  {openedBuba.name}
                </p>
                <p className="text-2xl text-yellow-400 mt-2">+{openedBuba.clickPower} за клик!</p>
              </div>
            ) : (
              <p className="text-3xl font-bold">Открываем кейс...</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
      `}</style>
    </div>
  );
}
