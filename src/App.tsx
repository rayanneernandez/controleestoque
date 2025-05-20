import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EstoqueProvider } from './context/EstoqueContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ProdutosLista from './pages/ProdutosLista';
import NovoProduto from './pages/NovoProduto';
import DetalheProduto from './pages/DetalheProduto';
import MovimentacoesLista from './pages/MovimentacoesLista';
import NovaMovimentacao from './pages/NovaMovimentacao';

function App() {
  return (
    <EstoqueProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<ProdutosLista />} />
            <Route path="produtos/novo" element={<NovoProduto />} />
            <Route path="produtos/:id" element={<DetalheProduto />} />
            <Route path="produtos/editar/:id" element={<DetalheProduto />} />
            <Route path="movimentacoes" element={<MovimentacoesLista />} />
            <Route path="movimentacoes/nova" element={<NovaMovimentacao />} />
            <Route path="fornecedores" element={<div className="p-8 text-center"><h1 className="text-xl">Página de Fornecedores em desenvolvimento</h1></div>} />
            <Route path="usuarios" element={<div className="p-8 text-center"><h1 className="text-xl">Página de Usuários em desenvolvimento</h1></div>} />
            <Route path="configuracoes" element={<div className="p-8 text-center"><h1 className="text-xl">Página de Configurações em desenvolvimento</h1></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EstoqueProvider>
  );
}

export default App;