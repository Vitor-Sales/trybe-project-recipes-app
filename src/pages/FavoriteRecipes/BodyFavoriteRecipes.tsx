import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './FavoriteRecipes.module.css';
import Favorite from '../../images/FavoriteRecipes.svg';
import all from '../../images/all.svg';
import food from '../../images/food.svg';
import drink from '../../images/drinks.svg';
import shareIcon from '../../images/shareIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';

// interface para representar uma receita
interface IRecipe {
  id: string;
  name: string;
  type: 'meal' | 'drink';
  category: string;
  alcoholicOrNot: string;
  nationality: string;
  image: string;
}

export default function BodyFavoriteRecipes() {
  const [favorites, setFavorites] = useState<IRecipe[]>([]);
  const [currentFilter, setCurrentFilter] = useState<'meal' | 'drink' | 'all'>('all');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Função para filtrar receitas por tipo (Meals, drinks ou nenhum filtro)
  const filterRecipes = (recipes: IRecipe[], filter: 'meal' | 'drink' | 'all')
  : IRecipe[] => {
    if (filter === 'all') {
      return recipes;
    }
    return recipes.filter((recipe) => recipe.type === filter);
  };
  // Função para manipular o clique no botão de filtro
  const handleFilterButtonClick = (filter: 'meal' | 'drink' | 'all'): void => {
    setCurrentFilter(filter);
    // Tirei pq reseta o que foi carregado do local storage
    // const filteredRecipes = filterRecipes(favorites, filter);
    // setFavorites(filteredRecipes);
  };
  // Função para manipular o clique no botão de desfavoritar
  const handleUnfavoriteClick = (id: string): void => {
    const newFavorites = favorites.filter((recipe) => recipe.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };
  // Função para compartilhar a receita
  const shareRecipe = (id: string, type: 'meal' | 'drink'): void => {
    const recipe = favorites.find((recipes) => recipes.id === id);
    if (recipe) {
      const recipeUrl = `http://localhost:3000/${type}s/${id}`;
      navigator.clipboard.writeText(recipeUrl).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 5000);
      });
    }
  };

  // Filtrar favoritos com base no filtro atual
  const filteredFavorites = filterRecipes(favorites, currentFilter);

  return (
    <div>
      <div className={ style.HeaderFavorite }>
        <img src={ Favorite } alt="Favorite" className={ style.icon } />
        <h1 data-testid="page-title" className={ style.titleFavorite }>
          Favorite Recipes
        </h1>
        <div className={ style.GroupCategory }>
          <button
            data-testid="filter-by-all-btn"
            type="button"
            className={ style.buttonsFavorite }
            onClick={ () => handleFilterButtonClick('all') }
          >
            <img src={ all } alt="All" />
            <span className={ style.Title }>All</span>
          </button>
          <button
            data-testid="filter-by-meal-btn"
            type="button"
            className={ style.buttonsFavorite }
            onClick={ () => handleFilterButtonClick('meal') }
          >
            <img src={ food } alt="food" />
            <span className={ style.Title }>Meal</span>
          </button>
          <button
            data-testid="filter-by-drink-btn"
            type="button"
            className={ style.buttonsFavorite }
            onClick={ () => handleFilterButtonClick('drink') }
          >
            <img src={ drink } alt="Drinks" />
            <span className={ style.Title }>Drinks</span>
          </button>
        </div>
      </div>
      <div className={ style.BodyFavoriteRecipes }>
        {filteredFavorites.map((recipe, index) => (
          <div key={ recipe.id } className={ style.CardFavoriteRecipes }>
            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <img
                className={ style.favoriteRecipeImage }
                src={ recipe.image }
                data-testid={ `${index}-horizontal-image` }
                alt={ recipe.name }
              />
            </Link>
            <div className={ style.favoriteRecipeInfo }>

              <Link
                to={ `/${recipe.type}s/${recipe.id}` }
                className={ style.favoriteRecipeName }
              >
                <span data-testid={ `${index}-horizontal-name` }>
                  {recipe.name }
                </span>
              </Link>
              <div className={ style.favoriteCategory }>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  { `${recipe.nationality} - ${recipe.category}` }
                </p>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  { recipe.alcoholicOrNot }
                </p>
              </div>
              <div className={ style.favoriteButtonGrup }>
                <button
                  className={ style.ButtonSocial }
                  onClick={ () => shareRecipe(recipe.id, recipe.type) }
                >
                  <img
                    src={ shareIcon }
                    alt="compartilhar"
                    data-testid={ `${index}-horizontal-share-btn` }
                  />
                  {linkCopied
                    && <span className={ style.shareMessage }>Link copied!</span>}
                </button>
                <button
                  className={ style.ButtonSocial }
                  onClick={ () => handleUnfavoriteClick(recipe.id) }
                >
                  <img
                    src={ blackHeartIcon }
                    alt="desfavoritar"
                    data-testid={ `${index}-horizontal-favorite-btn` }
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
