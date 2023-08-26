
foo :: Ord a => [a] -> Maybe [a]
foo xs =
  listToMaybe . tails. sort $ xs 

bar :: (a -> b) -> (b -> c) -> (a -> c)
bar f g =
  f >>> g
