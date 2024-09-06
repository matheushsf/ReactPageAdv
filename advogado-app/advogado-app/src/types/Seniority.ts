export enum Seniority {
    Junior = 0,
    Pleno = 1,
    Senior = 2,
}

export const getSeniorityLabel = (seniority: number): string => {
    switch (seniority) {
      case Seniority.Junior:
        return 'Junior';
      case Seniority.Pleno:
        return 'Pleno';
      case Seniority.Senior:
        return 'Senior';
      default:
        return 'Desconhecido'; 
    }
  };