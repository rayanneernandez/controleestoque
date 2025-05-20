import React, { useState } from 'react';
import { Menu, X, Package, BarChart3, FileText, Truck, Users, Settings, Bell, Search, ChevronDown } from 'lucide-react';
import { useEstoque } from '../../context/EstoqueContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Badge from '../ui/Badge';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);
  const { alertas, marcarAlertaComoLido } = useEstoque();
  const location = useLocation();
  
  const alertasNaoLidos = alertas.filter(alerta => !alerta.lido);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, current: location.pathname === '/' },
    { name: 'Produtos', href: '/produtos', icon: Package, current: location.pathname.startsWith('/produtos') },
    { name: 'Movimentações', href: '/movimentacoes', icon: FileText, current: location.pathname.startsWith('/movimentacoes') },
    { name: 'Fornecedores', href: '/fornecedores', icon: Truck, current: location.pathname.startsWith('/fornecedores') },
    { name: 'Usuários', href: '/usuarios', icon: Users, current: location.pathname.startsWith('/usuarios') },
    { name: 'Configurações', href: '/configuracoes', icon: Settings, current: location.pathname.startsWith('/configuracoes') },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleNotificacoes = () => {
    setNotificacoesOpen(!notificacoesOpen);
  };
  
  const handleMarcarComoLido = (id: string) => {
    marcarAlertaComoLido(id);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para mobile */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={toggleSidebar}
      />
      
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">EstoqueApp</span>
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-600"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                item.current
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${
                  item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Conteúdo principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm lg:shadow sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center lg:hidden">
              <button
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar..."
                  type="search"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="relative p-1 text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={toggleNotificacoes}
                >
                  <Bell className="h-6 w-6" />
                  {alertasNaoLidos.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                      {alertasNaoLidos.length}
                    </span>
                  )}
                </button>
                
                {notificacoesOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-2 px-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                        {alertasNaoLidos.length > 0 && (
                          <Badge variant="danger" size="sm">{alertasNaoLidos.length} não lidos</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto py-1 divide-y divide-gray-200">
                      {alertas.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Nenhuma notificação disponível
                        </div>
                      ) : (
                        alertas.map(alerta => (
                          <div
                            key={alerta.id}
                            className={`px-4 py-2 hover:bg-gray-50 ${!alerta.lido ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {alerta.tipo === 'baixo' ? 'Estoque Baixo' : 'Vencimento'}
                              </p>
                              <span className="text-xs text-gray-500">{alerta.data}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{alerta.mensagem}</p>
                            {!alerta.lido && (
                              <button
                                className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => handleMarcarComoLido(alerta.id)}
                              >
                                Marcar como lido
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4 relative flex items-center">
                <button className="flex items-center text-sm text-gray-700 focus:outline-none">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Usuário"
                  />
                  <span className="ml-2 hidden lg:block">Administrador</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;