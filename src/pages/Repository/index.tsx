import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronsLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logogithub.svg';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issues {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repositorio, setRepositorio] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issues[]>([]);

  useEffect(() => {
    api.get(`/repos/${params.repository}`).then(response => {
      setRepositorio(response.data);
    });

    api.get(`/repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="logo" />
        <Link to="/">
          <FiChevronsLeft /> voltar
        </Link>
      </Header>

      {repositorio && (
        <RepositoryInfo>
          <header>
            <img
              src={repositorio.owner.avatar_url}
              alt={repositorio.owner.login}
            />
            <div>
              <strong>{repositorio.full_name}</strong>
              <p>{repositorio.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repositorio.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repositorio.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repositorio.open_issues_count}</strong>
              <span>Issues Abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
