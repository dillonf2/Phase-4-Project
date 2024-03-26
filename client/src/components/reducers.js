const initialState = {
    foundersByProject: {}
  };

  const founderReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_FOUNDER':
        const { projectId, founderId } = action.payload;
        return {
          ...state,
          foundersByProject: {
            ...state.foundersByProject,
            [projectId]: [...(state.foundersByProject[projectId] || []), founderId]
          }
        };
      case 'REMOVE_FOUNDER':
        const { projectId: idToRemoveFrom, founderId: idToRemove } = action.payload;
        return {
          ...state,
          foundersByProject: {
            ...state.foundersByProject,
            [idToRemoveFrom]: state.foundersByProject[idToRemoveFrom].filter(id => id !== idToRemove)
          }
        };
      default:
        return state;
    }
  };

  export default founderReducer;