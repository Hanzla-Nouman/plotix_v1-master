export default function getFirstLettersOfName(name: string) {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1];

  if (!lastName) {
    return firstName[0].toUpperCase();
  }

  return firstName[0].toUpperCase() + ' ' + lastName[0].toUpperCase();
}
