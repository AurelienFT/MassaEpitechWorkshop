# EPITECH Workshop

Dans ce workshop nous allons voir les bases pour déployer un contrat sur la blockchain Massa.
Les contrats sur Massa sont dévelopés en AssemblyScript (un language très proche du TypeScript).
Nous allons commencer par déployer un contrat très simple pour comprendre le processus pour finir par la création d'un contrat autonome qui simule les changements de marché d'un prix.

### Étape 1 : Déploiement du premier contrat

Tout d'abord vérifiez que vous avez `npm` et `node` d'installer si ce n'est pas le cas, vous pouvez le faire depuis : https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script

Ensuite rendez-vous dans le dossier `contracts/` et lancez la commande pour installer les dépendances utilisées pour les smart contracts : 
```
npm i
```

Le code du smart contract se situe dans `contracts/assembly/contracts/` dans le fichier `autonoumousprice.ts`. Il y a beaucoup de commentaires qui explique son fonctionnement prenez-en connaissance.

Une fois les commentaires lus, si vous avez la moindre question/incompréhension demandez-moi :)
Compilez le contrat avec la commande : 
```
npm run build
```

Maintenant déployons ce premier smart contract sur le réseau builder de Massa appelé le : buildnet.

Pour cela utilisez la clé privée `S12TmaQPEhf68M6Mb4xfXodkYjMgWKBoXdV17cpomVMUoAnFPaxf` et placez là dans le fichier `contracts/.env`. Cette clé est reliée à une addresse déjà provisionnée avec des coins pour vous permettre de payer les coûts de déploiement du contrat sur la chaine. Pour le déployer utilisez la commande :
```
npm run deploy
```

Vous devriez avoir un événement affiché dans votre terminal avec des informations sur le déploiement de votre smart contract.
Dans ces données vous pouvez récupérer l'addresse du smart contract dans la phrase : "Contract deployed at address: AS...".

Rendez vous sur un de nos exploreurs : https://massexplo.io/ cliquez sur la planète en haut à droite pour passer sur le réseau buildnet et copiez l'addresse dans le champ de recherche. Il devrait vous trouvez l'addresse de votre contrat avec 1 MAS. Si ce n'est pas le cas, dites-moi je viendrais vous aider :)

Les contrats à Massa sont immutable par défaut ce qui signifie qu'ils ne sont pas modifiables.
A chaque fois que vous allez modifier le code durant ce workshop vous devrez re-compiler le contrat : `npm run build` et le rédeployer à nouvelle addresse avec `npm run deploy`.

### Étape 2 : Stockage du prix persistent

Dans cette étape nous allons voir comment on peut sauvegarder des valeurs dans le stockage du smart contract pour qu'il puisse lu par les acteurs extérieur à la chaîne ou par les futures utilisations de fonctions du smart contract.

Ajoutez la valeur 2 à la clé PRICE_KEY dans le stockage du smart-contract depuis la fonction `updatePrice()`.

Pour convertir un nombre en string vous pouvez utiliser la fonction `.toString()`.
Pour interagir avec le stockage utilisez notre objet `Storage` documentation : https://as-sdk.docs.massa.net/modules/Storage.html

Une fois que vous pensez avoir une version fonctionnelle rendez-vous sur : https://massa-epitech-workshop.vercel.app/ . Entrez votre addresse et vous devriez voir le montant apparaitre après quelques secondes. Il est automatiquement récupéré sur la blockchain.

### Étape 3 : Ajout de l'update du prix aléatoire de manière régulière

Changez le code de l'étape 2 pour que la fonction mette un prix aléatoire entre 0 et la constante `MAX_PRICE` dans le stockage. Vous pouvez utiliser la fonction `unsafeRandom()` que nous fournissons pour avoir un nombre aléatoire en 0 et la valeur maximale d'un nombre. (le modulo est pratique pour borner avec `MAX_PRICE`).

La fonction `updatePrice` peut être appelé de manière régulière automatiquement en ajoutant un appel à `sendFutureOperation()` à la fin de la fonction.

Verifiez que votre contrat fonctionne bien en utilisant le site : https://massa-epitech-workshop.vercel.app/ et en attendant les refresh. Il devrait se mettre à jour toutes les 16 secondes

### Étape 4 : Variation de prix en fonction du prix actuel

Changez le cote de l'étape 3, pour lui permettre de faire évoluer le prix en fonction d'un pourcentage. Pour cela récupérez la valeur du prix via le système de Storage présenté précedemment et utilisez l'aléatoire pour le faire varier de plusieurs pourcent à chaque appel à cette fonction.

Utilisez le site : https://massa-epitech-workshop.vercel.app/ pour vérifier que tout fonctionne bien.

### La suite

Vous êtes trop forts, venez me voir on en parle :)