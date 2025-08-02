import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

export default function Index() {
  const levels = [
    {
      id: 1,
      name: "Побег из камеры",
      difficulty: "Легкий",
      description: "Ваше первое испытание. Найдите способ выбраться из тюремной камеры через вентиляцию.",
      obstacles: ["Решетки", "Тихий режим", "Охранники"],
      completed: false
    },
    {
      id: 2,
      name: "Лазерные ловушки",
      difficulty: "Средний", 
      description: "Пройдите через коридор с лазерными системами безопасности. Одно неверное движение - и вас поймают.",
      obstacles: ["Лазеры", "Паркур", "Датчики движения"],
      completed: false
    },
    {
      id: 3,
      name: "Битва с боссом",
      difficulty: "Сложный",
      description: "Финальное противостояние со злым главным надзирателем. Используйте все свои навыки для победы.",
      obstacles: ["Босс-полицейский", "Ловушки", "Ограниченное время"],
      completed: false
    }
  ]

  const features = [
    {
      icon: "ShieldX",
      title: "Тюремная атмосфера",
      description: "Мрачные коридоры и камеры создают аутентичную атмосферу побега"
    },
    {
      icon: "Zap", 
      title: "Лазерные ловушки",
      description: "Множество препятствий и ловушек на вашем пути к свободе"
    },
    {
      icon: "Target",
      title: "Паркур система",
      description: "Прыжки, лазание и акробатические трюки для преодоления препятствий"
    },
    {
      icon: "Skull",
      title: "Битва с боссом",
      description: "Эпичное противостояние с главным антагонистом игры"
    }
  ]

  return (
    <div className="min-h-screen bg-prison-black text-white">
      {/* Header */}
      <header className="border-b border-prison-gray/30 bg-prison-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="ShieldX" size={32} className="text-danger-red" />
              <h1 className="font-title text-2xl font-bold">PRISON ESCAPE</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#gameplay" className="hover:text-danger-red transition-colors">Геймплей</a>
              <a href="#levels" className="hover:text-danger-red transition-colors">Уровни</a>  
              <a href="#screenshots" className="hover:text-danger-red transition-colors">Скриншоты</a>
              <Button className="bg-danger-red hover:bg-danger-red/80 text-white font-semibold">
                Скачать игру
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-prison-black via-cell-dark to-prison-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-title text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-prison-gray to-danger-red bg-clip-text text-transparent">
              PRISON ESCAPE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Самый захватывающий побег из тюрьмы! Пройдите через лазерные ловушки, 
              преодолейте паркур препятствия и сразитесь с главным босс-полицейским.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-danger-red hover:bg-danger-red/80 text-white font-semibold px-8 py-3 text-lg">
                <Icon name="Download" className="mr-2" size={20} />
                Скачать сейчас
              </Button>
              <Button size="lg" variant="outline" className="border-laser-green text-laser-green hover:bg-laser-green hover:text-prison-black font-semibold px-8 py-3 text-lg">
                <Icon name="Play" className="mr-2" size={20} />
                Смотреть трейлер
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="gameplay" className="py-20 bg-cell-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl md:text-5xl font-bold mb-4">Особенности игры</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Уникальный геймплей, сочетающий стелс, паркур и экшн элементы
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-prison-black/60 border-prison-gray/30 hover:border-danger-red/50 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-danger-red/20 rounded-full flex items-center justify-center mb-4">
                    <Icon name={feature.icon as any} size={32} className="text-danger-red" />
                  </div>
                  <CardTitle className="font-title text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl md:text-5xl font-bold mb-4">Уровни испытаний</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Каждый уровень - это новый вызов с уникальными препятствиями и головоломками
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {levels.map((level) => (
              <Card key={level.id} className="bg-gradient-to-b from-cell-dark to-prison-black border-prison-gray/30 hover:border-laser-green/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={level.difficulty === "Легкий" ? "secondary" : level.difficulty === "Средний" ? "default" : "destructive"}
                      className={level.difficulty === "Легкий" ? "bg-laser-green text-prison-black" : level.difficulty === "Средний" ? "bg-yellow-500 text-prison-black" : "bg-danger-red text-white"}
                    >
                      {level.difficulty}
                    </Badge>
                    <span className="text-prison-gray text-sm">Уровень {level.id}</span>
                  </div>
                  <CardTitle className="font-title text-2xl text-white">{level.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Препятствия:</h4>
                      <div className="flex flex-wrap gap-2">
                        {level.obstacles.map((obstacle, index) => (
                          <Badge key={index} variant="outline" className="border-danger-red/50 text-danger-red">
                            {obstacle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-prison-gray hover:bg-danger-red transition-colors"
                      disabled={level.completed}
                    >
                      {level.completed ? "Пройден" : "Играть уровень"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="py-20 bg-cell-dark/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl md:text-5xl font-bold mb-4">Скриншоты игры</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Погрузитесь в атмосферу мрачной тюрьмы и адреналина побега
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-prison-gray/30 hover:border-danger-red/50 transition-all duration-300">
              <img 
                src="/img/513f2bba-2be6-4d02-bb1f-1ac1b2bc72d9.jpg" 
                alt="Тюремная камера" 
                className="aspect-video object-cover w-full"
              />
              <div className="absolute inset-0 bg-danger-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Icon name="ZoomIn" size={32} className="text-white" />
              </div>
            </div>
            <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-prison-gray/30 hover:border-danger-red/50 transition-all duration-300">
              <img 
                src="/img/5b635a72-8706-4f3d-9415-f68ddf110ee6.jpg" 
                alt="Лазерные ловушки" 
                className="aspect-video object-cover w-full"
              />
              <div className="absolute inset-0 bg-danger-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Icon name="ZoomIn" size={32} className="text-white" />
              </div>
            </div>
            <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-prison-gray/30 hover:border-danger-red/50 transition-all duration-300">
              <img 
                src="/img/46067fef-0807-475b-931d-9d3bfc4387ce.jpg" 
                alt="Босс-полицейский" 
                className="aspect-video object-cover w-full"
              />
              <div className="absolute inset-0 bg-danger-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Icon name="ZoomIn" size={32} className="text-white" />
              </div>
            </div>
            {[4, 5, 6].map((i) => (
              <div key={i} className="relative group cursor-pointer overflow-hidden rounded-lg border border-prison-gray/30 hover:border-danger-red/50 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-prison-black via-cell-dark to-prison-gray flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Image" size={48} className="text-prison-gray mx-auto mb-2" />
                    <p className="text-prison-gray text-sm">Скриншот {i}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-danger-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Icon name="ZoomIn" size={32} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-prison-black via-danger-red/20 to-prison-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-title text-4xl md:text-5xl font-bold mb-6">Готовы к побегу?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Скачайте Prison Escape прямо сейчас и испытайте самый захватывающий побег в своей жизни!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-danger-red hover:bg-danger-red/80 text-white font-semibold px-12 py-4 text-xl">
              <Icon name="Download" className="mr-2" size={24} />
              Скачать бесплатно
            </Button>
            <div className="text-sm text-gray-400">
              <p>Доступно для Windows, Mac, Linux</p>
              <p>Размер: 2.5 GB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-prison-gray/30 py-12 bg-prison-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="ShieldX" size={24} className="text-danger-red" />
                <span className="font-title text-xl font-bold">PRISON ESCAPE</span>
              </div>
              <p className="text-gray-400">
                Самая захватывающая игра про побег из тюрьмы с элементами паркура и стелса.
              </p>
            </div>
            <div>
              <h3 className="font-title text-lg font-semibold mb-4">Игра</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Системные требования</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Обновления</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-title text-lg font-semibold mb-4">Разработчики</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Другие игры</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-prison-gray/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Prison Escape Game. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}